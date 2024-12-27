import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import 'material-symbols';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import { HttpStatusCode, isAxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
        localStorage.clear();
        location.href = '/';
        return null;
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
        location.href = '/';
        return null;
      }
    },
  }),
});
const root = document.getElementById('root');
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
