import React from 'react';
import Recommendations from './components/Recommendations';
import './styles/App.css';
import images from './assets/images.jpeg'

function App() {
  return (
    <div className="App">

<div className="content">

      <h1>Welcome to the Product Recommendations App</h1>

    <Recommendations />
    </div>

    <div className="image">
        <img src={images} alt="logo" />
      </div>

    </div>
  );
}

export default App;
