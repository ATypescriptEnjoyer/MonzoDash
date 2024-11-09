import { Button, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useMutation } from '../api';
import { useLocalStorage } from '@uidotdev/usehooks';

export const AppLogin = (): JSX.Element => {
  const theme = useTheme();
  const sendAuthCodeMutation = useMutation<boolean>('login/auth-code', { method: 'POST' });
  const submitAuthCodeMutation = useMutation<boolean, { code: string }>('login/auth-code');
  const signOutMutation = useMutation('auth/signout', { method: 'POST' });
  const [_, setCode] = useLocalStorage('auth-code');

  const handleCodeChange = (value: string) => {
    if (value.length === 6) {
      submitAuthCodeMutation.mutate(
        { code: value },
        {
          onSuccess: (response) => {
            if (response) {
              setCode(value);
              window.location.reload();
            }
          },
        },
      );
    }
  };

  const handleSendAuthCode = () =>
    sendAuthCodeMutation.mutate(
      {},
      {
        onError: () =>
          signOutMutation.mutate(
            {},
            {
              onSuccess: () => {
                location.href = '/';
              },
            },
          ),
      },
    );

  return (
    <Stack flex={1} justifyContent="center" alignItems="center" gap={4}>
      <Stack justifyContent="center" alignItems="center">
        <Typography variant="h2" fontWeight="bold">
          Login Expired
        </Typography>
        <Typography variant="subtitle1" fontSize="1.5em">
          Please re-authenticate with MonzoDash
        </Typography>
      </Stack>
      {sendAuthCodeMutation.isSuccess && (
        <TextField variant="outlined" onChange={(event) => handleCodeChange(event.currentTarget.value)} />
      )}
      {sendAuthCodeMutation.isIdle && (
        <Button onClick={handleSendAuthCode} sx={{ width: '50%', marginTop: theme.spacing(2) }} variant="outlined">
          <Typography padding={theme.spacing(1)} variant="button" fontSize="1.5em">
            Login With Monzo
          </Typography>
        </Button>
      )}
    </Stack>
  );
};
