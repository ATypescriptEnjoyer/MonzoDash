import React, { useEffect, useState } from 'react';
import { ApiConnector } from '../network';
import { Stack, Typography, useTheme, Button } from '@mui/material';

export const Login = (): JSX.Element => {
  const theme = useTheme();
  const [monzoUrl, setMonzoUrl] = useState('');

  useEffect(() => { ApiConnector.get<string>('/auth/redirectUri').then((data) => setMonzoUrl(data.data)) }, []);

  return (
    <Stack justifyContent='center' alignItems='center' width='100%' >
      <Typography variant='h1'>MonzoDash</Typography>
      <Typography variant='h4' padding={theme.spacing(2)}>The Ultimate Monzo Web Dashboard</Typography>
      <Button sx={{ width: '50%', marginTop: theme.spacing(2) }} variant='outlined' disabled={!monzoUrl} href={monzoUrl}>
        <Typography padding={theme.spacing(1)} variant='button' fontSize='1.5em'>Login With Monzo</Typography>
      </Button>
    </Stack>
  );
};
