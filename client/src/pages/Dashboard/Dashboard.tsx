import React, { useState, useEffect } from 'react';
import { Module, SpendingRow, UnselectableTypography } from '../../components';
import {
  DashContainer,
  Modules,
  StyledDedicatedSpendingPie,
  TransactionList,
  EmployerInfoChild,
  EmployerInfoContainer,
  TransactionDay,
  TransactionContainer,
  TransactionDayTitle,
  TransactionDayHeader,
  TransactionDailyCount,
  DailyCountContainers,
  LoadingContainer,
  SpendingSetup,
} from './Dashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { DedicatedFinance, CurrentFinances } from '../../../../shared/interfaces/finances';
import { Transaction, TransactionItem } from '../../../../shared/interfaces/transaction';
import { ApiConnector } from '../../network';
import { BubbleDataPoint, Chart, ChartData, ChartOptions, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { TransactionItem as TransactionItemComponent } from '../../components/TransactionItem';
import { Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat, CalendarToday } from '@mui/icons-material';
import { MoonLoader } from 'react-spinners';

interface Employer {
  name: string;
  payDay: number;
}

export const Dashboard = (): JSX.Element => {
  const [name, setName] = useState<string>('User');
  const [employerInfoExists, setEmployerInfoExists] = useState(false);
  const [employerInfo, setEmployerInfo] = useState<Employer>({ name: '', payDay: 1 });
  const [currentFinances, setCurrentFinances] = useState<CurrentFinances>();
  const [spendingData, setSpendingData] = useState<{ status: boolean; data: DedicatedFinance[] }>({
    status: false,
    data: [{ id: '0', name: 'Unassigned', amount: 0, colour: '#FFFFFF' }],
  });
  const [spendingBackup, setSpendingBackup] = useState<DedicatedFinance[]>([]);
  const [isEditingDedicatedSpending, setIsEditingDedicatedSpending] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [doughnutData, setDoughnutData] = useState<ChartData<'doughnut'>>();

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
      if (!data.status) {
        setSpendingData((baseObject) => ({ status: data.status, data: [...baseObject.data, ...data.data] }));
      } else {
        setSpendingData(data);
        setDoughnutData(createDoughnutData(data));
      }
    };
    const getTransactions = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Transaction[]>('/transactions');
      setTransactions(data);
    };
    Promise.all([getName(), getEmployer(), getCurrentFinances(), getDedicatedSpending(), getTransactions()]).then(() =>
      setLoading(false),
    );
  }, []);

  const createDoughnutData = (givenData: { status: boolean; data: DedicatedFinance[] }): ChartData<'doughnut'> => {
    const calculateSalaryUnassigned = (): number => {
      const salary = givenData.data.find((finance) => finance.id === '0')?.amount || 0;
      const leftOver = givenData.data
        .filter((finance) => finance.id !== '0')
        .reduce((prev, curr) => (prev -= curr.amount), salary);
      return leftOver;
    };

    return {
      labels: givenData.data.map((data) => (data.id === '0' ? 'Unassigned' : data.name)),
      datasets: [
        {
          data: givenData.data.map((data) => (data.id === '0' ? calculateSalaryUnassigned() : data.amount)),
          backgroundColor: givenData.data.map((data) => data.colour),
        },
      ],
    };
  };

  const handleChartResize = (
    chart: Chart<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint | null)[], unknown>,
  ): void => {
    if (chart.options.plugins?.legend) {
      if (window.innerWidth <= 900) {
        chart.options.plugins.legend.position = 'left';
        return;
      }
      chart.options.plugins.legend.position = 'chartArea';
    }
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
    onResize: handleChartResize,
  };

  const submitEmployerInformation = async (): Promise<void> => {
    await ApiConnector.put('/employer', employerInfo);
    setEmployerInfoExists(true);
  };

  const onDedicatedFinanceUpdate = (dedicatedFinance: DedicatedFinance): void => {
    const currFinances = spendingData.data;
    const currIndex = currFinances.findIndex((value) => value.id === dedicatedFinance.id);
    if (currIndex > -1) {
      currFinances[currIndex] = dedicatedFinance;
    }
    setSpendingData({ status: false, data: currFinances });
  };

  const submitSpendingData = async (): Promise<void> => {
    const { data } = await ApiConnector.post<{ status: boolean; data: DedicatedFinance[] }>(
      '/finances/dedicated',
      spendingData.data,
    );
    setSpendingData(data);
    setDoughnutData(createDoughnutData(data));
    setIsEditingDedicatedSpending(false);
  };

  const onDedicatedSpendingEditClick = async (): Promise<void> => {
    setSpendingBackup([...spendingData.data]);
    setSpendingData(({ data }) => ({ status: false, data: data }));
    setIsEditingDedicatedSpending(true);
  };

  const onDedicatedSpendingCloseClick = async (): Promise<void> => {
    setSpendingData({ status: true, data: [...spendingBackup] });
    setSpendingBackup([]);
    setIsEditingDedicatedSpending(false);
  };

  const generateTransactionDays = (): JSX.Element => {
    const generateDailyFinance = (transactions: TransactionItem[]): { incoming: number; outgoing: number } => {
      return transactions
        .filter((transact) => !transact.internal) //Don't include pot transactions as "real" transactions.
        .reduce(
          (prev, curr) => {
            const amt = Math.abs(curr.amount);
            if (curr.type === 'incoming') {
              return { incoming: prev.incoming + amt, outgoing: prev.outgoing };
            }
            return { incoming: prev.incoming, outgoing: prev.outgoing + amt };
          },
          { incoming: 0, outgoing: 0 },
        );
    };

    return (
      <TransactionContainer>
        {transactions.map((transaction) => {
          const { incoming, outgoing } = generateDailyFinance(transaction.transactions);

          return (
            <TransactionDay>
              <TransactionDayHeader>
                <TransactionDayTitle>
                  <CalendarToday />
                  {transaction.title}
                </TransactionDayTitle>
                <DailyCountContainers>
                  <TransactionDailyCount isPositive={true}>
                    <TrendingUp />
                    <span>£{Math.abs(incoming).toFixed(2)}</span>
                  </TransactionDailyCount>
                  <TransactionDailyCount isPositive={false}>
                    <TrendingDown />
                    <span>£{Math.abs(outgoing).toFixed(2)}</span>
                  </TransactionDailyCount>
                  <TransactionDayTitle>
                    <TrendingFlat />
                    <span>£{(incoming - outgoing).toFixed(2)}</span>
                  </TransactionDayTitle>
                </DailyCountContainers>
              </TransactionDayHeader>
              <TransactionList>
                {transaction.transactions.map((transactionItem) => (
                  <TransactionItemComponent
                    Merchant={transactionItem.description}
                    key={transactionItem.id}
                    Icon={transactionItem.logoUrl}
                    Amount={transactionItem.amount}
                    Type={transactionItem.type}
                  />
                ))}
              </TransactionList>
            </TransactionDay>
          );
        })}
      </TransactionContainer>
    );
  };

  return loading ? (
    <LoadingContainer>
      <MoonLoader color="#F8C8DC" size="80" title="Loading..." />
      <h1>Loading...</h1>
    </LoadingContainer>
  ) : (
    <DashContainer>
      {name && (
        <UnselectableTypography sx={{ marginBottom: '20px' }} variant="h4" fontWeight="300" color="inherit">
          Welcome Back, {name}
        </UnselectableTypography>
      )}
      <Modules employerSet={employerInfoExists && !!currentFinances}>
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
          <Module HeaderText="Current Finances">
            <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '10px' }}>
              £{(currentFinances.balancePence / 100).toFixed(2)} left for {currentFinances.daysTilPay} days
            </Typography>
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              That's £{(currentFinances.perDayPence / 100).toFixed(2)} per day!
            </Typography>
          </Module>
        )}
        <Module verticalSpace={2} HeaderText="Transactions">
          {generateTransactionDays()}
        </Module>
        <Module
          HeaderText="Dedicated Spending"
          isEditing={isEditingDedicatedSpending}
          onEditClick={onDedicatedSpendingEditClick}
          onEditCancelClick={onDedicatedSpendingCloseClick}
        >
          {spendingData.status && doughnutData && <StyledDedicatedSpendingPie data={doughnutData} options={opts} />}
          {!spendingData.status && (
            <>
              <SpendingSetup>
                {spendingData.data.map((value) => (
                  <SpendingRow
                    id={value.id}
                    key={value.id}
                    name={value.id === '0' ? 'Salary' : value.name}
                    amount={value.amount}
                    colour={value.colour}
                    dynamicPot={value.dynamicPot}
                    onRowUpdate={onDedicatedFinanceUpdate}
                  />
                ))}
              </SpendingSetup>
              <Button variant="contained" onClick={submitSpendingData}>
                Save Dedicated Spending
              </Button>
            </>
          )}
        </Module>
      </Modules>
    </DashContainer>
  );
};
