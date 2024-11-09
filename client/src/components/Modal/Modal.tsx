import { Header, MainContainer } from './Modal.styled';
import { Icon } from '../Icon';
import { Dialog, Button, Typography, Box, Stack } from '@mui/material';

interface Props {
  title: string;
  onClose: () => void;
  show: boolean;
  saveText?: string;
  onSubmit: () => void;
}

type ModalProps = Props & React.HTMLAttributes<HTMLDivElement>;

export const Modal = ({ title, onClose, show, children, saveText, onSubmit, ...rest }: ModalProps) => {
  return (
    <Dialog open={show} fullWidth maxWidth="lg">
      <MainContainer>
        <Header>
          <Typography variant="h5">{title}</Typography>
          <Icon icon="close" onClick={onClose} />
        </Header>
        <Box flex={1}>{children}</Box>
        <Stack justifyContent="center" alignItems="center">
          <Button onClick={onSubmit} variant="outlined" fullWidth sx={{ maxWidth: '60%' }}>
            <Typography variant="button" fontSize="1em">
              {saveText || 'Submit'}
            </Typography>
          </Button>
        </Stack>
      </MainContainer>
    </Dialog>
  );
};
