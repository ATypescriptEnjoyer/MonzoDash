import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import 'material-symbols';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();
const root = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootContainer = createRoot(root!);

rootContainer.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
