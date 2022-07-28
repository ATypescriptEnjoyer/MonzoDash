import React, { useState, useEffect } from 'react';
import { Module, UnselectableTypography } from '../../components';
import { DashContainer, Modules, StyledDedicatedSpendingPie } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';

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
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        hoverOffset: 4,
      },
    ],
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
          <StyledDedicatedSpendingPie data={data} options={{ maintainAspectRatio: false }} />
        </Module>
        <Module HeaderText="Empty Module"></Module>
        <Module HeaderText="Recent Transactions">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
              </tr>
              <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
              </tr>
            </tbody>
          </table>
        </Module>
      </Modules>
    </DashContainer>
  );
};
