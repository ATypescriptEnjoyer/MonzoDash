import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { colours } from '../theme';

interface Props {
  title: string;
  onClose: () => void;
  open: boolean;
  saveText?: string;
  onSubmit: () => void;
  children: React.ReactNode;
}

export const Modal = ({ title, onClose, open, children, saveText, onSubmit }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: (theme) => ({
          justifyContent: 'space-between',
          gap: theme.spacing(2),
          backgroundColor: colours.black,
          border: `2px solid ${colours.pink}`,
          padding: theme.spacing(4),
        }),
      }}
    >
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Typography variant="h5">{title}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Stack>
      <Box sx={{ overflowY: 'auto' }}> {children}</Box>
      <Stack justifyContent="center" alignItems="center">
        <Button onClick={onSubmit} variant="outlined" fullWidth sx={{ maxWidth: '60%' }}>
          <Typography variant="button" fontSize="1em">
            {saveText ?? 'Submit'}
          </Typography>
        </Button>
      </Stack>
    </Dialog>
  );
};
