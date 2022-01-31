import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Setup, Dashboard } from './pages';
import { StyledApp } from './App.styled';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App(): JSX.Element {
  return (
    <StyledApp className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/setup" element={<Setup />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledApp>
  );
}

export default App;
