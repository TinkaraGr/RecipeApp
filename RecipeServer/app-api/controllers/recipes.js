const fs = require('fs').promises;
const path = require('path');

// Path to the simulated JSON "database"
const DB_PATH = path.join(__dirname, '..', 'database', 'recipes.json');
// Path to the index file that stores the last used recipe id
const INDEX_PATH = path.join(__dirname, '..', 'database', 'recipes_index.json');

// Simple in-process write serialization to avoid read-modify-write races
let writeQueue = Promise.resolve();

function serializeWrite(fn) {
	const next = writeQueue.then(() => fn(), () => fn());
	// Ensure the queue keeps progressing even if a job rejects
	writeQueue = next.catch(() => {});
	return next;
}

async function atomicWrite(filePath, data) {
	const dir = path.dirname(filePath);
	const tmp = path.join(dir, `.tmp-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
	await fs.writeFile(tmp, data, 'utf8');
	try {
		await fs.rename(tmp, filePath);
		return;
	} catch (err) {
		if (err && err.code === 'EXDEV') {
			await fs.copyFile(tmp, filePath);
			await fs.unlink(tmp);
			return;
		}
		if (err && (err.code === 'EEXIST' || err.code === 'EPERM' || err.code === 'ENOTEMPTY')) {
			try {
				await fs.unlink(filePath);
			} catch (unlinkErr) {
				try { await fs.unlink(tmp); } catch (e) {}
				throw err;
			}
			await fs.rename(tmp, filePath);
			return;
		}
		try { await fs.unlink(tmp); } catch (e) {}
		throw err;
	}
}

// R - Get all recipes
async function getAllRecipes(req, res) {
	console.log('Fetching all recipes...');
	try {
		let file;
		try {
			file = await fs.readFile(DB_PATH, 'utf8');
		} catch (readErr) {
			console.error('Failed to read recipes database:', readErr);
			return res.status(500).json({ error: 'Failed to read recipes database' });
		}
		const recipes = JSON.parse(file || '[]');
		console.log(`Found ${recipes.length} recipes.`);
		return res.status(200).json(recipes);
	} catch (err) {
		console.error('Failed to read recipes database:', err);
		return res.status(500).json({ error: 'Failed to read recipes database' });
	}
}

// R - Get recipe by id
async function getRecipeById(req, res) {
	// Validate that an id parameter was provided
	if (req.params && req.params.id) {

		const id = req.params.id;

		console.log('URL params received');

		try {

			console.log(`Looking up recipe with id: ${id}`);

			let file;
			try {
				file = await fs.readFile(DB_PATH, 'utf8');
			} catch (readErr) {
				console.error('Failed to read recipes database:', readErr);
				return res.status(500).json({ error: 'Failed to read recipes database' });
			}
			const recipes = JSON.parse(file || '[]');
			const recipe = recipes.find(c => {
				return String(c.id) === id;
			});

			if (!recipe) {
				console.error(`Recipe with id ${id} not found`);
				return res.status(404).json({ error: `Recipe with id ${id} not found` });
			}

			console.log('Recipe found');

			return res.status(200).json(recipe);
		} catch (err) {
			console.error('Failed to read recipes database:', err);
			return res.status(500).json({ error: 'Failed to read recipes database' });
		}
	} else {
		console.error('Missing recipe id in URL params');
		return res.status(400).json({ error: 'Missing recipe id in URL params' });
	}
}

// C - Create a recipe
async function createRecipe(req, res) {
	// Validation
	if (req.body && req.body.title && req.body.level && req.body.time && req.body.ingredients && req.body.description) {

		try {
			console.log('Creating new recipe...');

			let file;
			try {
				file = await fs.readFile(DB_PATH, 'utf8');
			} catch (readErr) {
				// If recipes file is missing treat as empty database
				if (readErr.code === 'ENOENT') {
					file = '[]';
				} else {
					console.error('Failed to read recipes database:', readErr);
					return res.status(500).json({ error: 'Failed to read recipes database' });
				}
			}
			const recipes = JSON.parse(file || '[]');

			// Read the index file to obtain the last used id
			let idxFile;
			try {
				idxFile = await fs.readFile(INDEX_PATH, 'utf8');
			} catch (idxErr) {
				console.error('Failed to read recipes index:', idxErr);
				return res.status(500).json({ error: 'Failed to read recipes index' });
			}
			const idxObj = JSON.parse(idxFile || '{}');

			if (!idxObj) {
				console.error('Error on index file');
				return res.status(500).json({ error: 'Error on index file' });
			}

			const lastIndex = Number(idxObj.recipes_index);

			const newId = Number(lastIndex) + 1;

			const newRecipe = {
				id: newId,
				title: String(req.body.title),
				image: req.body.image ? String(req.body.image) : null,
				level: Number(req.body.level),
				time: String(req.body.time),
                ingredients: String(req.body.ingredients),
                description: String(req.body.description)
			};

			recipes.push(newRecipe);

			// First, prepare the new index object
			const newIdxObj = { recipes_index: newId };

			// Persist index and recipes inside the write-serialization queue
			await serializeWrite(async () => {
				await atomicWrite(INDEX_PATH, JSON.stringify(newIdxObj, null, 2));
				await atomicWrite(DB_PATH, JSON.stringify(recipes, null, 2));
			});

			console.log('New recipe created with id:', newId);

			return res.status(201).json(newRecipe);
		} catch (err) {
			console.error('Failed to create recipe:', err);
			return res.status(500).json({ error: 'Failed to create recipe' });
		}
	} else {
		console.error('Missing required recipe fields');
		return res.status(400).json({ error: 'Missing required recipe fields' });
	}
}

// U - Update recipe by id
async function updateRecipe(req, res) {
	// Validate that an id parameter was provided
	if (req.params && req.params.id) {

		const id = req.params.id;

		console.log('URL params received');

		// Basic validation
		if (req.body && req.body.title && req.body.level && req.body.time && req.body.ingredients && req.body.description) {
			try {
				console.log(`Updating recipe with id: ${id}`);

				let file;
				try {
					file = await fs.readFile(DB_PATH, 'utf8');
				} catch (readErr) {
					console.error('Failed to read recipes database:', readErr);
					return res.status(500).json({ error: 'Failed to read recipes database' });
				}
				const recipes = JSON.parse(file || '[]');

				// find recipe by id
				const idx = recipes.findIndex(c => String(c.id) === id);
				if (idx === -1) {
					console.error(`Recipe with id ${id} not found`);
					return res.status(404).json({ error: `Recipe with id ${id} not found` });
				}

				console.log('Recipe found, updating...');

				const existing = recipes[idx];

				// Update allowed fields if provided
				existing.title = String(req.body.title);
				existing.image = req.body.image ? String(req.body.image) : null;
				existing.level = Number(req.body.level);
				existing.time = String(req.body.time);
				existing.ingredients = String(req.body.ingredients);
				existing.description = String(req.body.description);

				// Persist updated recipes in the write-serialization queue
				await serializeWrite(async () => {
					await atomicWrite(DB_PATH, JSON.stringify(recipes, null, 2));
				});

				console.log(`Recipe with id ${id} updated successfully`);

				return res.status(200).json(existing);
			} catch (err) {
				console.error('Failed to update recipe:', err);
				return res.status(500).json({ error: 'Failed to update recipe' });
			}
		} else {
			console.error('Missing required recipe fields');
			return res.status(400).json({ error: 'Missing required recipe fields' });
		}
	} else {
		console.error('Missing recipe id in URL params');
		return res.status(400).json({ error: 'Missing recipe id in URL params' });
	}
}

// D - Delete recipe by id
async function deleteRecipe(req, res) {
	// Validate that an id parameter was provided
	if (req.params && req.params.id) {
		const id = req.params.id;
		console.log('URL params received');

		try {
			console.log(`Deleting recipe with id: ${id}`);

			let file;
			try {
				file = await fs.readFile(DB_PATH, 'utf8');
			} catch (readErr) {
				console.error('Failed to read recipes database:', readErr);
				return res.status(500).json({ error: 'Failed to read recipes database' });
			}
			const recipes = JSON.parse(file || '[]');

			// find recipe index by id
			const idx = recipes.findIndex(c => String(c.id) === id);
			if (idx === -1) {
				console.error(`Recipe with id ${id} not found`);
				return res.status(404).json({ error: `Recipe with id ${id} not found` });
			}

			console.log('Recipe found, deleting...');

			// remove the recipe
			recipes.splice(idx, 1)[0];

			// Persist updated recipes in the write-serialization queue
			await serializeWrite(async () => {
				await atomicWrite(DB_PATH, JSON.stringify(recipes, null, 2));
			});

			console.log(`Recipe with id ${id} deleted successfully`);

			return res.status(204).json();
		} catch (err) {
			console.error('Failed to delete recipe:', err);
			return res.status(500).json({ error: 'Failed to delete recipe' });
		}
	} else {
		console.error('Missing recipe id in URL params');
		return res.status(400).json({ error: 'Missing recipe id in URL params' });
	}
}

module.exports = {
	getAllRecipes,
	getRecipeById,
	createRecipe,
	updateRecipe,
	deleteRecipe,
};