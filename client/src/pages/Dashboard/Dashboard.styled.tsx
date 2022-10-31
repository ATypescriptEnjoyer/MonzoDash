import styled from 'styled-components';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

export const DashContainer = styled.div`
  padding: 70px;
  display: grid;
  grid-template-rows: min-content 1fr;
  box-sizing: border-box;
  @media screen and (max-width: 900px) {
    text-align: center;
  }

  @media screen and (max-width: 900px) {
    padding: 16px;
  }
`;

export const Modules = styled.div<{ employerSet: boolean }>`
  gap: 120px 12px;
  display: grid;
  grid-template-columns: 0.5fr 0.5fr;

  grid-template-rows: ${(props): string => (props.employerSet ? '0.3fr 0.7fr' : '0.5fr 0.5fr')};

  @media screen and (max-width: 900px) {
    /* grid-template-columns: 1fr;
    grid-template-rows: 1fr; */
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const StyledDedicatedSpendingPie = styled(Doughnut)``;

export const TransactionList = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  padding-right: 16px;
  box-sizing: border-box;
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

export const TransactionDay = styled.div`
  width: 100%;
`;

export const TransactionDayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 32px;
`;

export const TransactionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow: auto;
  max-height: 100%;
`;

export const TransactionDayTitle = styled.h4`
  text-transform: uppercase;
`;
