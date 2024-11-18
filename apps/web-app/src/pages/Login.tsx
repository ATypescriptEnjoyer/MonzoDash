import { Stack, Typography, useTheme, Button } from '@mui/material';
import { useQuery } from '../api';

export const Login = (): JSX.Element => {
  const theme = useTheme();
  const { isFetching, data } = useQuery<string>('auth/redirecturi');

  return (
    <Stack justifyContent="center" alignItems="center" width="100%" flex={1}>
      <Typography variant="h1">MonzoDash</Typography>
      <Typography variant="h4" padding={theme.spacing(2)}>
        The Ultimate Monzo Web Dashboard
      </Typography>
      <Button sx={{ width: '50%', marginTop: theme.spacing(2) }} variant="outlined" disabled={isFetching} href={data}>
        <Typography padding={theme.spacing(1)} variant="button" fontSize="1.5em">
          Login With Monzo
        </Typography>
      </Button>
    </Stack>
  );
};
