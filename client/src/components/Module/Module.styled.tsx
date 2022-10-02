import { Typography } from '@mui/material';
import styled from 'styled-components';

export const ModuleContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModuleHeader = styled(Typography)`
  color: white;
  display: block;
  text-align: center;

  && {
    margin-bottom: 24px;
    font-weight: bold;
  }

  @media screen and (max-width: 900px) {
    text-align: center;
  }
`;

export const ModuleBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;

  @media screen and (max-width: 900px) {
    padding: 0;
  }
`;
