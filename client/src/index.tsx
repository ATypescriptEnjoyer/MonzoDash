import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const root = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootContainer = createRoot(root!);

rootContainer.render(
  <ThemeProvider theme={theme}>
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
