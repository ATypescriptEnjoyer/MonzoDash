import React, { useState, useEffect } from 'react';
import { AppBar, UnselectableTypography } from '../../components';
import { DashboardContainer, DashboardContent } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState('');

  useEffect(() => {
    const getName = async (): Promise<void> => {
      let { data } = await ApiConnector.get<string | Owner>('/monzo/getUser');
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      const firstName = (data as Owner).preferred_first_name;
      setName(firstName);
    };
    getName();
  }, []);

  return (
    <DashboardContainer>
      <AppBar />
      <DashboardContent>
        <UnselectableTypography variant="h4" fontWeight="300" color="inherit">
          Welcome Back, {name}
        </UnselectableTypography>
      </DashboardContent>
    </DashboardContainer>
  );
};
