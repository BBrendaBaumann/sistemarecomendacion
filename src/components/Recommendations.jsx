import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css';

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);

  useEffect(() => {
    console.log('Fetching products with filterGlutenFree:', filterGlutenFree);
    axios.post('http://localhost:3000/recommend', {
      user_id: '67890',
      preferences: {
        high_protein: true,
        gluten_free: filterGlutenFree,
      }
    }).then(response => {
      console.log('Received response:', response.data);
      setProducts(response.data.recommended_products);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [filterGlutenFree]);

  const handleFilterChange = () => {
    console.log('Filter button clicked'); // Para verificar que se está llamando a la función
    setFilterGlutenFree(!filterGlutenFree);
  };

  return (
    <div className="recommendation-container">
      <button className={`filter-button ${filterGlutenFree ? 'active' : ''}`} 
  onClick={handleFilterChange}>

        {filterGlutenFree ? 'Show All Products' : 'Show Only Gluten-Free Products'}
      </button>

      <div className="product-list">
      {console.log('Products state:', products)}
      {products.length > 0 ? (
        products.map((product, index) => (
          <div className="product-card" key={index}>
            <h2 className="product-name">{product.product_name}</h2>
            <p className="product-reason">{product.reason}</p>
          </div>
        ))
      ) : (
        <p>No products match your preferences.</p>
      )}
    </div>
      {/* {products.map((product, index) => (
        <div className="product-card" key={index}>
          <h2 className="product-name">{product.product_name}</h2>
          <p className="product-reason">{product.reason}</p>
        </div>
      ))}
      </div> */}
    </div>
  );
};

export default Recommendations;
