/* const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Cargar datos desde archivos JSON
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));


// Validación y manejo del endpoint /recommend
app.post('/recommend', [
  body('user_id').isString().notEmpty().withMessage('User ID is required and should be a string'),
  body('preferences').isObject().withMessage('Preferences should be an object'),
  body('preferences.high_protein').isBoolean().optional(),
  body('preferences.gluten_free').isBoolean().optional(),
  body('preferences.low_carb').isBoolean().optional()
], (req, res) => {
  // Validación de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, preferences } = req.body;

  // Validar usuario
  const user = users.find(u => u.id === user_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Filtrar productos basados en las preferencias
  let recommendedProducts = products.filter(product => {
    // Filtrar por preferencias de macronutrientes
    const macronutrientMatch = Object.keys(preferences).every(key => {
      if (key in product.macronutrients) {
        return preferences[key] === product.macronutrients[key];
      }
      return true; // No aplicar el filtro si el key no está en product.macronutrients
    });

    // Filtrar por restricciones dietéticas
    const glutenFreeMatch = !preferences.gluten_free || product.gluten_free;

    return macronutrientMatch && glutenFreeMatch;
  });


  // Limitar a 3 productos
  recommendedProducts = recommendedProducts.slice(0, 3);

  // Preparar la respuesta
  const response = recommendedProducts.map(product => ({
    product_name: product.name,
    reason: `High in ${Object.keys(preferences).find(key => preferences[key] === true).replace('_', ' ')}` 
  }));

  res.json({
    user_id,
    recommended_products: response
  });
});


module.exports = app; */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

// Cargar datos desde archivos JSON
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));

app.post('/recommend', [
    body('user_id').isString().notEmpty().withMessage('User ID is required and should be a string'),
    body('preferences').isObject().withMessage('Preferences should be an object'),
    body('preferences.high_protein').isBoolean().optional(),
    body('preferences.gluten_free').isBoolean().optional(),
    body('preferences.low_carb').isBoolean().optional() // No olvides esta preferencia si es relevante
  ], (req, res) => {
    // Validación de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { user_id, preferences } = req.body;
  
    // Verificar si el usuario existe
    const user = users.find(u => u.id === user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Filtrar productos basados en las preferencias
    let recommendedProducts = products.filter(product => {
      // Verificar que todos los macronutrientes preferidos coincidan
      const macronutrientMatch = Object.keys(preferences).every(key => {
        if (key in product.macronutrients) {
          return preferences[key] === product.macronutrients[key];
        }
        return true; // No aplicar el filtro si la key no está en product.macronutrients
      });
  
      // Filtrar por restricciones dietéticas
      const glutenFreeMatch = !preferences.gluten_free || product.gluten_free;
  
      return macronutrientMatch && glutenFreeMatch;
    });
  
    // Limitar a 3 productos
    recommendedProducts = recommendedProducts.slice(0, 3);
  
    // Preparar la respuesta
    const response = recommendedProducts.map(product => ({
      product_name: product.name,
      reason: `Matches your preferences`
    }));
  
    res.json({
      user_id,
      recommended_products: response
    });
  });

module.exports = app;

