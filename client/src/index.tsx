import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import { ThemeProvider } from 'styled-components';
import 'material-symbols';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

const root = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootContainer = createRoot(root!);

const theme = {
  black: '#0e1217',
  grey: '#2b333e',
  lightGrey: '#838d9e',
  white: '#F5F5F5',
  pink: '#fe648f',
  blue: '#4ee0fe',
};

export type ThemeType = typeof theme;

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
