const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'skrivniKljucZaJWT123';

/* KRMILNIKI */
const ctrlRecipes = require('../controllers/recipes');
const ctrlAuth = require('../controllers/auth');

/* Avtentikacija */
router.post('/signup', ctrlAuth.signUp); // Registracija novega uporabnika
router.post('/login', ctrlAuth.login); // Prijava uporabnika

/* Kontakti - varovano */
router.get('/recipes', authenticateToken, ctrlRecipes.getAllRecipes);   //Pridobi vse recepte
router.get('/recipes/:id', authenticateToken, ctrlRecipes.getRecipeById); // Pridobi posamezen recept
router.post('/recipes', authenticateToken, ctrlRecipes.createRecipe); // Ustvari nov recept
router.put('/recipes/:id', authenticateToken, ctrlRecipes.updateRecipe); // Posodobi recept
router.delete('/recipes/:id', authenticateToken, ctrlRecipes.deleteRecipe); // Izbrisi recept


/* Middleware za preverjanje JWT */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        console.error('Unauthorized - Token not provided');
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Forbidden - Invalid token:', err);
            return res.status(403).json({ error: 'Forbidden - Invalid token' });
        }
        req.user = user;
        next();
    });
}

module.exports = router;