import { styled } from '@mui/material/styles';
import { colours } from '../../theme';

export const MainContainer = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  width: 100%;
  height: 70%;
  background-color: ${colours.black};
  border: 2px solid ${colours.pink};
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    height: 100%;
    border: 0;
  }
`;

export const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;
