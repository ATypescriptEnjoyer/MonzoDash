import { Stack, Typography } from '@mui/material';
import { useQuery } from '../network/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '@uidotdev/usehooks';

export const TwoFactor = () => {
  const { pathname } = useLocation();
  const { data } = useQuery<boolean>('auth/verified', { refetchInterval: 5000 });
  const [_, setCode] = useLocalStorage('auth-code');
  const [params] = useSearchParams();

  if (params.has('code')) {
    setCode(params.get('code'));
    location.href = pathname;
  }

  if (data) {
    location.href = '/app/dashboard';
  }

  return (
    <Stack justifyContent="center" alignItems="center" flex={1} gap={1.5}>
      <Typography variant="h1" fontSize="3em">
        2FA Required
      </Typography>
      <Typography variant="subtitle1" fontSize="1.5em" textAlign="center">
        Check your Monzo app to verify the login!
      </Typography>
    </Stack>
  );
};
