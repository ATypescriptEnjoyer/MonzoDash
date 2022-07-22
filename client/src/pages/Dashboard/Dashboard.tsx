import React, { useState, useEffect } from 'react';
import { UnselectableTypography } from '../../components';
import { DashboardContent } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';
export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState('');

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getUser');
      const firstName = (data as Owner).preferred_first_name;
      setName(firstName);
    };
    getName();
  }, []);

  return (
    <DashboardContent>
      <UnselectableTypography sx={{ marginBottom: '20px' }} variant="h4" fontWeight="300" color="inherit">
        Welcome Back, {name}
      </UnselectableTypography>
    </DashboardContent>
  );
};
