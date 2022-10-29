import { Typography } from '@mui/material';
import styled from 'styled-components';

export const ModuleContainer = styled.div`
  min-height: 100%;
  height: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-sizing: border-box;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 900px) {
    padding: 0;
  }
`;
