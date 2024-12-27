import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import routes from './Routes';
import { useQuery } from './api';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Stack } from '@mui/material';

function App() {
  const isAuthed = useQuery<{ status: boolean; error: string }>('auth/isauthed');
  const [code] = useLocalStorage<string>('auth-code');
  const routing = useRoutes(routes(isAuthed.data?.status === true && !!code));
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthed.data?.status === true && !code && location.pathname !== '/app-login') {
    navigate('/app-login');
  }

  if (isAuthed.data?.error === '2FA Pending' && location.pathname !== '/login/verify') {
    navigate('/login/verify');
  }
  return (
    <Stack height="100vh" width="100vw" className="App">
      {isAuthed.isFetched ? routing : null}
    </Stack>
  );
}

export default App;
