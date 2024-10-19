import React from 'react';
import './App.css';
import DynamicRows from './Components/DynamicRows';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Bulk Card Input</h1>
      <DynamicRows />
    </div>
  );
};

export default App;
