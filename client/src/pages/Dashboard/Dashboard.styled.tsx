import styled from 'styled-components';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

export const DashContainer = styled.div`
  margin: 70px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Modules = styled.div`
  gap: 12px;
  flex: 1;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
`;

export const StyledDedicatedSpendingPie = styled(Pie)``;
