import React, { useState, useEffect } from 'react';
import { Module, UnselectableTypography } from '../../components';
import { DashContainer, Modules, StyledDedicatedSpendingPie, ModuleList } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';
import { ChartOptions } from 'chart.js';
import { TransactionItem } from '../../components/TransactionItem';

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState('Sasha');

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getUser');
      setName(data.preferred_first_name);
    };
    getName();
  }, []);

  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
      },
    ],
  };

  const opts: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'left',
        align: 'start',
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <DashContainer>
      {name && (
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="h4" fontWeight="300" color="inherit">
          Welcome Back, {name}
        </UnselectableTypography>
      )}
      <Modules>
        <Module HeaderText="Empty Module"></Module>
        <Module HeaderText="Dedicated Spending">
          <StyledDedicatedSpendingPie data={data} options={opts} />
        </Module>
        <Module HeaderText="Empty Module"></Module>
        <Module HeaderText="Recent Transactions">
          <ModuleList>
            <TransactionItem Merchant="Test Merchant" Type="Income" Amount={100} />
            <TransactionItem Merchant="Test Merchant" Type="Outgoing" Amount={200} />
            <TransactionItem Merchant="Test Merchant" Type="Income" Amount={300} />
            <TransactionItem Merchant="Test Merchant" Type="Outgoing" Amount={400} />
            <TransactionItem Merchant="Test Merchant" Type="Income" Amount={500} />
            <TransactionItem Merchant="Test Merchant" Type="Outgoing" Amount={600} />
            <TransactionItem Merchant="Test Merchant" Type="Income" Amount={700} />
          </ModuleList>
        </Module>
      </Modules>
    </DashContainer>
  );
};
