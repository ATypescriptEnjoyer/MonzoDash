import { Stack, Typography, useTheme } from '@mui/material';
import MoonLoader from 'react-spinners/MoonLoader';

interface Props {
  size?: string | number;
  text?: string;
}

export const Loader = (props: Props) => {
  const { size, text } = props;
  const theme = useTheme();
  return (
    <Stack justifyContent="center" alignItems="center" width="100%" height="100%">
      <MoonLoader color={theme.palette.primary.main} size={size || 36} title="Loading..." />
      <Typography variant="h4">{text || 'Loading'}</Typography>
    </Stack>
  );
};
