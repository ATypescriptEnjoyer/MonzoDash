import { BackContainer, Body, Header, MainContainer, Title, Footer } from './Modal.styled';
import { Icon } from '../Icon';
import { Dialog, Button, Typography } from '@mui/material';

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
          <Title>{title}</Title>
          <Icon icon="close" onClick={onClose} />
        </Header>
        <Body>{children}</Body>
        <Footer>
          <Button onClick={onSubmit} variant="outlined" fullWidth sx={{ maxWidth: '60%' }}>
            <Typography variant="button" fontSize="1em">
              {saveText || 'Submit'}
            </Typography>
          </Button>
        </Footer>
      </MainContainer>
    </Dialog>
  );
};
