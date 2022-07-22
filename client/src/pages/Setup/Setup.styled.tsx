import styled from 'styled-components';
import { Button } from '@mui/material';

export const StyledContainer = styled.div`
  display: flex;
  flex: 1;
`;

export const StyledColourBox = styled.div`
  background-color: #1f2022;
  flex: 0.4;
`;

export const StyledActionBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  flex: 0.6;
`;

export const StyledTitle = styled.h1`
  font-size: 3em;
  padding: 0;
  margin: 0 0 12px 0;
`;

export const StyledSubtitle = styled.h3`
  font-size: 1.5em;
  color: #a1a1a1;
  padding: 0;
  margin: 0 0 44px 0;
`;

export const StyledButton = styled(Button)`
  width: 60%;
`;
