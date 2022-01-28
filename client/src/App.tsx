import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Setup, Dashboard } from './pages';
import { StyledApp } from './App.styled';

function App(): JSX.Element {
  return (
    <StyledApp className="App">
      <Router>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </StyledApp>
  );
}

export default App;
