import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import 'material-symbols';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import QueryClient from './QueryClient';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const rootContainer = createRoot(root);

rootContainer.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <QueryClient>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </QueryClient>
    </Router>
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
