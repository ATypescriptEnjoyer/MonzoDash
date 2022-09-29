import React, { useState, useEffect } from 'react';
import { Module, UnselectableTypography } from '../../components';
import {
  DashContainer,
  Modules,
  StyledDedicatedSpendingPie,
  ModuleList,
  EmployerInfoChild,
  EmployerInfoContainer,
} from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { ApiConnector } from '../../network';
import { ChartOptions } from 'chart.js';
import { TransactionItem } from '../../components/TransactionItem';
import { Button, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material';

interface Employer {
  name: string;
  payDay: number;
}

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState<string>();
  const [employerInfoExists, setEmployerInfoExists] = useState(false);
  const [employerInfo, setEmployerInfo] = useState<Employer>({ name: '', payDay: 1 });

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getuser');
      setName(data.preferred_first_name);
    };
    const getEmployer = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Employer>('/dash/employer');
      if (data.name) {
        setEmployerInfo(data);
        setEmployerInfoExists(true);
      }
    };
    getName();
    getEmployer();
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

  const submitEmployerInformation = async (): Promise<void> => {
    await ApiConnector.put('/dash/employer', employerInfo);
    setEmployerInfoExists(true);
  };

  return (
    <DashContainer>
      {name && (
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="h4" fontWeight="300" color="inherit">
          Welcome Back, {name}
        </UnselectableTypography>
      )}
      <Modules>
        {!employerInfoExists && (
          <Module HeaderText="Employer Information">
            <EmployerInfoContainer>
              <EmployerInfoChild>
                <UnselectableTypography
                  sx={{ marginBottom: '20px' }}
                  variant="subtitle1"
                  fontWeight="300"
                  color="inherit"
                >
                  Employer Name (As is on Monzo!):
                </UnselectableTypography>
                <FormControl fullWidth>
                  <Input
                    value={employerInfo?.name}
                    onChange={(event): void => setEmployerInfo({ ...employerInfo, name: event.currentTarget.value })}
                  />
                </FormControl>
              </EmployerInfoChild>
              <EmployerInfoChild>
                <UnselectableTypography
                  sx={{ marginBottom: '20px' }}
                  variant="subtitle1"
                  fontWeight="300"
                  color="inherit"
                >
                  Pay Day:
                </UnselectableTypography>
                <FormControl fullWidth>
                  <InputLabel id="payday-label">Pay Day</InputLabel>
                  <Select
                    value={employerInfo.payDay}
                    labelId="payday-label"
                    label="Pay Day"
                    onChange={(value): void =>
                      setEmployerInfo({ ...employerInfo, payDay: value.target.value as number })
                    }
                  >
                    {Array.from(Array(31).keys()).map((value) => (
                      <MenuItem value={value + 1}>{value + 1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </EmployerInfoChild>
            </EmployerInfoContainer>
            <Button variant="contained" onClick={submitEmployerInformation}>
              Save Employer Information
            </Button>
          </Module>
        )}
        <Module HeaderText="Dedicated Spending">
          <StyledDedicatedSpendingPie data={data} options={opts} />
        </Module>
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
