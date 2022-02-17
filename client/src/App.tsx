import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { StyledApp } from './App.styled';
import { ApiConnector } from './network';
import routes from './Routes';

function App(): JSX.Element {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isMonzoAuthed, setIsMonzoAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const { data } = await ApiConnector.get<boolean>('/auth/isauthed');
      setIsMonzoAuthed(data);
      setCheckedAuth(true);
    };
    checkAuth();
  }, []);

  const routing = useRoutes(routes(isMonzoAuthed));

  return <StyledApp className="App">{checkedAuth ? routing : null}</StyledApp>;
}

export default App;
