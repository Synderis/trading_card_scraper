import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicRows from './Components/DynamicRows';
import ResultsPage from './ResultsPage'; // Make sure to import your results page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <DynamicRows />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
