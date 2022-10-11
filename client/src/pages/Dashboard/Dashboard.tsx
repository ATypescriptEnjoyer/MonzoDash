import React, { useState, useEffect } from 'react';
import { Module, SpendingRow, UnselectableTypography } from '../../components';
import {
  DashContainer,
  Modules,
  StyledDedicatedSpendingPie,
  ModuleList,
  EmployerInfoChild,
  EmployerInfoContainer,
} from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { DedicatedFinance, CurrentFinances } from '../../../../shared/interfaces/finances';
import { ApiConnector } from '../../network';
import { ChartOptions } from 'chart.js';
import { TransactionItem } from '../../components/TransactionItem';
import { Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';

interface Employer {
  name: string;
  payDay: number;
}

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState<string>();
  const [employerInfoExists, setEmployerInfoExists] = useState(false);
  const [employerInfo, setEmployerInfo] = useState<Employer>({ name: '', payDay: 1 });
  const [currentFinances, setCurrentFinances] = useState<CurrentFinances>();
  const [spendingData, setSpendingData] = useState<{ status: boolean; data: DedicatedFinance[] }>({
    status: false,
    data: [{ name: 'Monthly Take Home', amount: 0, colour: '#FFFFFF' }],
  });

  useEffect(() => {
    const getName = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Owner>('/monzo/getuser');
      setName(data.preferred_first_name);
    };
    const getEmployer = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Employer>('/employer');
      if (data.name) {
        setEmployerInfo(data);
        setEmployerInfoExists(true);
      }
    };
    const getCurrentFinances = async (): Promise<void> => {
      const { data } = await ApiConnector.get<CurrentFinances>('/finances/current');
      if (data.balancePence > 0) {
        setCurrentFinances(data);
      }
    };
    const getDedicatedSpending = async (): Promise<void> => {
      const { data } = await ApiConnector.get<{ status: boolean; data: DedicatedFinance[] }>('/finances/dedicated');
      setSpendingData(data);
    };
    getName();
    getEmployer();
    getCurrentFinances();
    getDedicatedSpending();
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
        position: 'chartArea',
        align: 'start',
        labels: {
          color: 'white',
        },
      },
    },
  };

  const submitEmployerInformation = async (): Promise<void> => {
    await ApiConnector.put('/employer', employerInfo);
    setEmployerInfoExists(true);
  };

  const onDedicatedFinanceUpdate = (dedicatedFinance: DedicatedFinance): void => {
    const currFinances = spendingData.data;
    const currIndex = currFinances.findIndex((value) => value.name === dedicatedFinance.name);
    if (currIndex > -1) {
      currFinances[currIndex] = dedicatedFinance;
    }
    setSpendingData({ status: false, data: currFinances });
  };

  const submitSpendingData = async (): Promise<void> => {
    //test
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
                      <MenuItem key={value + 1} value={value + 1}>
                        {value + 1}
                      </MenuItem>
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
        {currentFinances && (
          <Module space={2} HeaderText="Current Finances">
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '10px' }}>
              £{(currentFinances.balancePence / 100).toFixed(2)} left for {currentFinances.daysTilPay} days
            </Typography>
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              That's £{(currentFinances.perDayPence / 100).toFixed(2)} per day!
            </Typography>
          </Module>
        )}
        <Module HeaderText="Dedicated Spending">
          {spendingData.status && <StyledDedicatedSpendingPie data={data} options={opts} />}
          {!spendingData.status && (
            <>
              {spendingData.data.map((value) => (
                <SpendingRow
                  key={value.name}
                  name={value.name}
                  amount={value.amount}
                  colour={value.colour}
                  onRowUpdate={onDedicatedFinanceUpdate}
                />
              ))}

              <Button variant="contained" onClick={submitSpendingData}>
                Save Dedicated Spending
              </Button>
            </>
          )}
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
