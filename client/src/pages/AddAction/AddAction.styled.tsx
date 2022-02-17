import { Button, Paper, styled as muiStyled } from '@mui/material';
import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const DashboardContent = styled.div`
  margin: 70px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ActionContainer = styled.div`
  margin-top: 60px;
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 60px;
`;

export const ActionSection = styled.div`
  flex: 0.5;
  display: flex;
  flex-direction: column;
`;

export const TriggerActionContainer = styled.div`
  margin-top: 36px;
`;

export const AddButton = styled(Button)`
  && {
    padding: 0;
  }
`;

export const AddContainer = muiStyled(Paper)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 6px 8px;
`;
