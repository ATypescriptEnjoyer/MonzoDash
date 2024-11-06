import React, { useState, useEffect } from 'react';
import { ApiConnector } from '../network';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField, Typography, useTheme } from '@mui/material';

export const AppLogin = (): JSX.Element => {
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();


  useEffect(() => {
    const validateCode = async (): Promise<void> => {
      const { data } = await ApiConnector.post<boolean>('/login/auth-code', { code: authCode });
      if (data) {
        localStorage.setItem('auth-code', authCode);
        window.location.reload();
      }
    };

    if (authCode.length === 6) {
      validateCode();
    }
  }, [authCode]);

  const sendAuthRequest = async (): Promise<void> => {
    try {
      await ApiConnector.get('/login/auth-code');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          await ApiConnector.post('/auth/signout').finally(() => navigate('/login'));
        }
      }
    }
    setAuthCodeSent(true);
  };

  return (
    <Stack flex={1} justifyContent='center' alignItems='center' gap={4}>
      <Stack justifyContent='center' alignItems='center'>
        <Typography variant='h2' fontWeight='bold' >Login Expired</Typography>
        <Typography variant='subtitle1' fontSize='1.5em'>Please re-authenticate with MonzoDash</Typography>
      </Stack>
      {authCodeSent && (
        <TextField variant='outlined' onChange={(value) => setAuthCode(value.currentTarget.value)} value={authCode} />
      )}
      {!authCodeSent &&
        <Button onClick={sendAuthRequest} sx={{ width: '50%', marginTop: theme.spacing(2) }} variant='outlined' >
          <Typography padding={theme.spacing(1)} variant='button' fontSize='1.5em'>Login With Monzo</Typography>
        </Button>
      }
    </Stack>
  );
};
