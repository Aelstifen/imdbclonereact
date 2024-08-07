import React from 'react';
import './App.css';
import Slider from './Components/Slider';
import Header from "./Components/Header";
import Menu from "./Components/Menu"; // Import the Slider component

function App() {
  return (
      <div className="App">
          <Menu />
        <header className="App-header">
          <Slider /> {/* Use the Slider component */}
        </header>
      </div>
  );
}

export default App;