import React, { useEffect } from 'react';
import { ApiConnector } from '../network';
import { Box, Stack, Typography } from '@mui/material';

export const TwoFactor = (): JSX.Element => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await ApiConnector.get<boolean>('/auth/verified');
      if (data) {
        window.location.href = '/app/dashboard';
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stack justifyContent='center' alignItems='center' flex={1} gap={1.5}>
      <Typography variant='h1' fontSize='3em' >2FA Required</Typography>
      <Typography variant='subtitle1' fontSize='1.5em' textAlign='center' >Check your Monzo app to verify the login!</Typography>
    </Stack>
  );
};
