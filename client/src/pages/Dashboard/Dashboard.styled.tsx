import styled from 'styled-components';
import 'chart.js/auto';
import { Doughnut, Pie } from 'react-chartjs-2';

export const DashContainer = styled.div`
  margin: 70px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 900px) {
    text-align: center;
  }

  @media screen and (max-width: 900px) {
    margin: 16px;
  }
`;

export const Modules = styled.div`
  gap: 12px;
  flex: 1;
  display: grid;
  grid-template-columns: 0.5fr 0.5fr;
  grid-template-rows: 0.5fr 0.5fr;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
`;

export const StyledDedicatedSpendingPie = styled(Doughnut)``;

export const ModuleList = styled.div`
  gap: 16px;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
`;

export const EmployerInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-bottom: 24px;
`;

export const EmployerInfoChild = styled.div`
  flex: 1;
`;
