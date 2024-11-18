import { Stack, Typography } from '@mui/material';
import MoonLoader from 'react-spinners/MoonLoader';
import { colours } from '../theme';

interface Props {
  size?: string | number;
  text?: string;
}

export const Loader = (props: Props) => {
  const { size, text } = props;
  return (
    <Stack justifyContent="center" alignItems="center" width="100%" height="100%">
      <MoonLoader color={colours.pink} size={size || 36} title="Loading..." />
      <Typography variant="h4">{text || 'Loading'}</Typography>
    </Stack>
  );
};
