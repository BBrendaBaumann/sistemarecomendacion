
const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));

app.post('/recommend', [
    body('user_id').isString().notEmpty().withMessage('User ID is required and should be a string'),
    body('preferences').isObject().withMessage('Preferences should be an object'),
    body('preferences.high_protein').isBoolean().optional(),
    body('preferences.gluten_free').isBoolean().optional(),
    body('preferences.low_carb').isBoolean().optional() 
  ], (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { user_id, preferences } = req.body;
  
    
    const user = users.find(u => u.id === user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    
    let recommendedProducts = products.filter(product => {
      
      const macronutrientMatch = Object.keys(preferences).every(key => {
        if (key in product.macronutrients) {
          return preferences[key] === product.macronutrients[key];
        }
        return true; 
      });
  
      
      const glutenFreeMatch = !preferences.gluten_free || product.gluten_free;
  
      return macronutrientMatch && glutenFreeMatch;
    });
  
    
    recommendedProducts = recommendedProducts.slice(0, 3);
  
    
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

