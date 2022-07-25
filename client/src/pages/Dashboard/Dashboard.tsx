import React, { useState, useEffect } from 'react';
import { UnselectableTypography } from '../../components';
import { DashboardContent } from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';
import ReactECharts from 'echarts-for-react';

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState('');

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getUser');
      setName(data.preferred_first_name);
    };
    getName();
  }, []);

  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1000, name: 'Test 1' },
          { value: 1000, name: 'Test 2' },
          { value: 1000, name: 'Test 3' },
          { value: 1000, name: 'Test 4' },
          { value: 1000, name: 'Test 5' },
        ],
      },
    ],
  };

  return (
    <DashboardContent>
      {name && (
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="h4" fontWeight="300" color="inherit">
          Welcome Back, {name}
        </UnselectableTypography>
      )}
      <ReactECharts option={option} />
    </DashboardContent>
  );
};
