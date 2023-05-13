import { Input } from '@mui/material';
import styled from 'styled-components';

export const SpendingRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
  background-color: white;
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
`;

export const SpendingRowHeader = styled.h3`
  color: black;
  text-align: center;
  padding: 0;
  margin: 0;
`;

export const SpendingRowItems = styled.div`
  display: flex;
  gap: 12px;
`;

export const SpendingRowItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SpendingInput = styled(Input)`
  background: #121212;
`;

export const SpendingRowLabel = styled.label`
  display: block;
  color: black;
  margin-bottom: 12px;
  text-align: center;
`;
