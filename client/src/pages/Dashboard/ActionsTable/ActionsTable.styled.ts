import { Box, Paper, Table, TableContainer } from '@mui/material';
import styled from 'styled-components';
import { UnselectableTypography } from '../../../components';

export const TableBox = styled(Box)`
  width: 100%;
  height: 100%;
`;

export const TablePaper = styled(Paper)`
  width: '100%';
  margin-bottom: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StyledTableContainer = styled(TableContainer)`
  flex: 1;
`;

export const StyledTable = styled(Table)`
  min-width: 750px;
`;

export const TableTitle = styled(UnselectableTypography)`
  flex: 1;
`;
