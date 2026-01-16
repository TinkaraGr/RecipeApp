const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const SECRET_KEY = 'skrivniKljucZaJWT123';

// Path to users simulated database
const USERS_PATH = path.join(__dirname, '..', 'database', 'users.json');
// Path to users index file
const USERS_INDEX_PATH = path.join(__dirname, '..', 'database', 'users_index.json');

// Simple in-process write serialization
let writeQueue = Promise.resolve();

function serializeWrite(fn) {
    const next = writeQueue.then(() => fn(), () => fn());
    writeQueue = next.catch(() => { });
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
        // Cross-device rename -> fallback to copy + unlink
        if (err && err.code === 'EXDEV') {
            await fs.copyFile(tmp, filePath);
            await fs.unlink(tmp);
            return;
        }
        // On Windows rename can fail if target exists/locked; try unlink then rename
        if (err && (err.code === 'EEXIST' || err.code === 'EPERM' || err.code === 'ENOTEMPTY')) {
            try {
                await fs.unlink(filePath);
            } catch (unlinkErr) {
                // cleanup tmp and rethrow original error
                try { await fs.unlink(tmp); } catch (e) {}
                throw err;
            }
            await fs.rename(tmp, filePath);
            return;
        }
        // Unknown error - try cleanup tmp and rethrow
        try { await fs.unlink(tmp); } catch (e) {}
        throw err;
    }
}

// Metoda za registracijo
async function signUp(req, res) {
    if (req.body && req.body.email && req.body.password) {
        
        console.log('Creating new user...');

        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        try {
            // Read users
            let usersFile;
            try {
                usersFile = await fs.readFile(USERS_PATH, 'utf8');
            } catch (readErr) {
                // If file missing, treat as empty array
                if (readErr.code === 'ENOENT') {
                    usersFile = '[]';
                } else {
                    console.error('Failed to read users database:', readErr);
                    return res.status(500).json({ error: 'Failed to read users database' });
                }
            }

            const users = JSON.parse(usersFile || '[]');

            // Check for existing email
            const exists = users.find(u => String(u.email).toLowerCase() === email);
            if (exists) {
                console.error(`User with email \'${email}\' already exists`);
                return res.status(409).json({ error: `User with email \'${email}\' already exists` });
            }

            // Read index to obtain last used user id
            let idxFile;
            try {
                idxFile = await fs.readFile(USERS_INDEX_PATH, 'utf8');
            } catch (idxErr) {
                if (idxErr.code === 'ENOENT') {
                    idxFile = '{}';
                } else {
                    console.error('Failed to read users index:', idxErr);
                    return res.status(500).json({ error: 'Failed to read users index' });
                }
            }

            const idxObj = JSON.parse(idxFile || '{}');

            if(!idxObj) {
				console.error('Error on index file');
				return res.status(500).json({ error: 'Error on index file' });
			}

			const lastIndex = Number(idxObj.users_index);

            const newId = Number(lastIndex) + 1;

            const newUser = {
                id: newId,
                email: email,
                password: password
            };

            users.push(newUser);

            const newIdxObj = { users_index: newId };

            // Persist users and index inside serialized write queue
            await serializeWrite(async () => {
                await atomicWrite(USERS_INDEX_PATH, JSON.stringify(newIdxObj, null, 2));
                await atomicWrite(USERS_PATH, JSON.stringify(users, null, 2));
            });

            // Issue JWT for the newly created user
            const payload = { userId: newUser.id, email: newUser.email };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

            console.log(`User with email \'${email}\' registered successfully`);

            return res.status(201).json({ token });
        } catch (err) {
            console.error('Failed to create user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    } else {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }
}

// Metoda za prijavo
async function login(req, res) {
    if (req.body && req.body.email && req.body.password) {

        try {
            const email = req.body.email;
            const password = req.body.password;

            // Read users database
            let usersFile;
            try {
                usersFile = await fs.readFile(USERS_PATH, 'utf8');
            } catch (readErr) {
                console.error('Failed to read users.json:', readErr);
                return res.status(500).json({ error: 'Failed to read users database' });
            }

            const users = JSON.parse(usersFile || '[]');

            // find user by email (case-insensitive)
            const user = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());

            if (!user) {
                console.error(`Invalid credentials - User with email \'${email}\' not found`);
                return res.status(401).json({ error: `Invalid credentials - User with email \'${email}\' not found` });
            }

            // Plaintext password comparison
            if (String(user.password) !== String(password)) {
                console.error(`Invalid credentials - Invalid password for user \'${email}\'`);
                return res.status(401).json({ error: `Invalid credentials - Invalid password for user \'${email}\'` });
            }

            // Successful login: issue JWT
            const payload = { userId: user.id, email: user.email };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

            console.log(`User with email \'${email}\' logged in successfully`);

            return res.status(200).json({ token });
        } catch (err) {
            console.error('Login failed:', err);
            return res.status(500).json({ error: 'Login failed' });
        }
    } else {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }
}

module.exports = {
    signUp,
    login
};