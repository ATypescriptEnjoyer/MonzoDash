import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { StyledApp } from './App.styled';
import { ApiConnector } from './network';
import routes from './Routes';

function App(): JSX.Element {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isMonzoAuthed, setIsMonzoAuthed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const { data } = await ApiConnector.get<boolean | string>('/auth/isauthed');
      if (data === '2FA pending') {
        setIsMonzoAuthed(false);
        setCheckedAuth(true);
      } else {
        setIsMonzoAuthed(data as boolean);
        setCheckedAuth(true);
      }
    };
    checkAuth().catch((error) => {
      setCheckedAuth(true);
      if (error.response.status === 401) {
        if (location.pathname !== '/app-login') {
          navigate('/app-login');
        }
      }
    });
  }, []);

  const routing = useRoutes(routes(isMonzoAuthed));

  return <StyledApp className="App">{checkedAuth ? routing : null}</StyledApp>;
}

export default App;
