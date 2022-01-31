import React from 'react';
import { AppBar } from '../../components';
import { DashboardContainer } from './Dashboard.styled';

export const Dashboard = (): JSX.Element => {
  return (
    <DashboardContainer>
      <AppBar />
    </DashboardContainer>
  );
};
