import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import routes from './Routes';
import { useQuery } from './api';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Stack } from '@mui/material';

function App(): JSX.Element {
  const isAuthed = useQuery<boolean | '2FA pending'>('auth/isauthed');
  const [code] = useLocalStorage<string>('auth-code');
  const routing = useRoutes(routes(isAuthed.data === true && !!code));
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthed.data === true && !code && location.pathname != '/app-login') {
    navigate('/app-login');
  }

  return (
    <Stack height="100vh" width="100vw" className="App">
      {isAuthed.isFetched ? routing : null}
    </Stack>
  );
}

export default App;
