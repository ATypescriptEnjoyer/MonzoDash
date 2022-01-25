import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Setup, Dashboard } from './pages';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
