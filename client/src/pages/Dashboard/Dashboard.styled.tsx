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

export const SpendingSetup = styled.div`
  overflow-y: auto;
  width: 100%;
  padding-right: 12px;
  margin-bottom: 12px;
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
    gap: 24px;
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
  margin-right: 16px;
  align-items: center;
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
  background-color: white;
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #121212;

  @media screen and (max-width: 900px) {
    font-size: 12px;
  }
`;

export const TransactionDailyCount = styled(TransactionDayTitle)<{ isPositive: boolean }>`
  color: ${(props): string => (props.isPositive ? '#80d195' : '#dc3545')};
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

export const DailyCountContainers = styled.div`
  display: flex;
  gap: 16px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #f8c8dc;
`;
