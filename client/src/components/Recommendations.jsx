import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css';

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length === 0) return; 

    const getRandomUserId = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex].id;
    };

    const userId = getRandomUserId(); 

    axios.post('http://localhost:3000/recommend', {
      user_id: userId,
      preferences: {
        high_protein: true,
        gluten_free: filterGlutenFree,
      }
    }).then(response => {
      
      setProducts(response.data.recommended_products);
    }).catch(error => {
      console.error('Error fetching products:', error);
    });
  }, [filterGlutenFree, users]);

  const handleFilterChange = () => {
    
    setFilterGlutenFree(!filterGlutenFree);
  };

  return (
    <div className="recommendation-container">
      <button className={`filter-button ${filterGlutenFree ? 'active' : ''}`} 
  onClick={handleFilterChange}>

        {filterGlutenFree ? 'Show All Products' : 'Show Only Gluten-Free Products'}
      </button>

      <div className="product-list">
      
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
      
    </div>
  );
};

export default Recommendations;
