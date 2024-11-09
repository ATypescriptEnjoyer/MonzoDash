import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { StyledApp } from './App.styled';
import routes from './Routes';
import { useQuery } from './network/api';
import { useLocalStorage } from '@uidotdev/usehooks';

function App(): JSX.Element {
  const isAuthed = useQuery<boolean | '2FA pending'>('auth/isauthed');
  const [code] = useLocalStorage<string>('auth-code');
  const routing = useRoutes(routes(isAuthed.data === true && !!code));
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthed.data === true && !code && location.pathname != '/app-login') {
    navigate('/app-login');
  }

  return <StyledApp className="App">{isAuthed.isFetched ? routing : null}</StyledApp>;
}

export default App;
