import { Stack, Typography } from '@mui/material';
import MoonLoader from 'react-spinners/MoonLoader';
import { colours } from '../theme';

export const Loader = () => {
  return (
    <Stack justifyContent="center" alignContent="center">
      <MoonLoader color={colours.pink} size={80} title="Loading..." />
      <Typography variant="h1">Loading...</Typography>
    </Stack>
  );
};
