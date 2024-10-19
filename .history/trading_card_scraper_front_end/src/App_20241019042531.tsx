import React from 'react';
import './App.css';
import DynamicRows from './Components/DynamicRows';
import ResultsTable from './Components/ResultsTable';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Bulk Card Input</h1>
      <DynamicRows />
      <ResultsTable />
    </div>
  );
};

export default App;
