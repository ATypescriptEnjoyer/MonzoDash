import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';
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
  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <Stack
        sx={(theme) => ({
          backgroundColor: colours.black,
          border: `2px solid ${colours.pink}`,
          padding: theme.spacing(4),
        })}
        gap={4}
      >
        <Stack justifyContent="space-between" direction="row" alignItems="center">
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <Box flex={1}>{children}</Box>
        <Stack justifyContent="center" alignItems="center">
          <Button onClick={onSubmit} variant="outlined" fullWidth sx={{ maxWidth: '60%' }}>
            <Typography variant="button" fontSize="1em">
              {saveText || 'Submit'}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
