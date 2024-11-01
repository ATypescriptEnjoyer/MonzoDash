import React, { useState, useEffect } from 'react';
import {
  Component,
  DashContainer,
  Group,
  Header,
  LoadingContainer,
  PageInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableLogo,
  TableRow,
  SpendingContainer,
  SpendingBar,
  SpendingBarItem,
  SpendingBoxContainer,
  LeftoverText,
  Label,
  TextBox,
  SalaryGroup,
  ToggleContainer,
} from './NewDashboard.styled';
import { Transaction } from '../../../../shared/interfaces/transaction';
import { ApiConnector } from '../../network';
import { MoonLoader } from 'react-spinners';
import { XAxis, YAxis, HorizontalGridLines, FlexibleXYPlot, AreaSeries, Hint, AreaSeriesPoint } from 'react-vis';
import { useTheme } from 'styled-components';
import { ThemeType } from '../..';
import moment from 'moment';
import { Icon, Modal, Toggle } from '../../components';
import { subscribe, unsubscribe, EVENT_TYPES } from '../../event';
import { DedicatedFinance } from '../../../../shared/interfaces/finances';
import { SpendingBox } from '../../components/SpendingBox';

interface employerInfo { id: string, name: string, payDay: number, paidOnHolidays: boolean, paidLastWorkingDay: boolean };

export const NewDashboard = (): JSX.Element => {
  const [transactionIndex, setTransactionIndex] = useState<number>(0);
  const [userTransactionIndex, setUserTransactionIndex] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);

  const [salaryData, setSalaryData] = useState<employerInfo>({ id: '', name: "", payDay: 28, paidOnHolidays: false, paidLastWorkingDay: false });
  const [spendingData, setSpendingData] = useState<(DedicatedFinance & { amountString: string })[]>();

  const [chartData, setChartDate] = useState<{ day: number; amount: number | null }[]>([]);
  const [hintValue, setHintValue] = useState<AreaSeriesPoint | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const salaryOpen = async () => {
      await getEmployerInformation();
      setShowSalaryModal(true);
    };
    const spendingOpen = async () => {
      await getDedicatedSpending();
      setShowSpendingModal(true);
    };
    subscribe(EVENT_TYPES.SALARY_DETAILS_OPEN, salaryOpen);
    subscribe(EVENT_TYPES.DEDICATED_SPENDING_OPEN, spendingOpen);

    return () => {
      unsubscribe(EVENT_TYPES.SALARY_DETAILS_OPEN, salaryOpen);
      unsubscribe(EVENT_TYPES.DEDICATED_SPENDING_OPEN, spendingOpen);
    };
  }, []);

  useEffect(() => {
    setUserTransactionIndex(`${transactionIndex + 1}`);
  }, [transactionIndex]);

  useEffect(() => {
    const getMonthlySpend = async (): Promise<void> => {
      const now = moment();
      const { data } = await ApiConnector.get<{ day: number; month: number; year: number; amount: number }[]>(
        `/daily-report/by-date/${now.year()}/${now.month() + 1}`,
      );
      const labels = Array.from(new Array(moment().daysInMonth() + 1).keys()).splice(1);
      const datesData = labels.map((val) => {
        const datesAmount = data.find((value) => value.day === val);
        return { day: val, amount: datesAmount ? datesAmount.amount : null };
      });
      setChartDate(datesData);
    };

    const getTransactions = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Transaction[]>('/transactions');
      setTransactions(data);
    };

    Promise.all([getMonthlySpend(), getTransactions(), getDedicatedSpending()]).then(() => setLoading(false));
  }, []);

  const changeUserTransactionIndex = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(+ev.currentTarget.value)) {
      setUserTransactionIndex(ev.currentTarget.value);
    }
  };

  const getEmployerInformation = async (): Promise<void> => {
    const { data } = await ApiConnector.get<employerInfo>('/employer');
    setSalaryData(data);
  };

  const getDedicatedSpending = async (): Promise<void> => {
    const { data } = await ApiConnector.get<DedicatedFinance[]>('/finances');
    const mappedData: (DedicatedFinance & { amountString: string })[] = data.map((finance) => ({
      ...finance,
      amountString: finance.amount.toFixed(2),
    }));
    setSpendingData(mappedData);
  };

  const generateLeftoverText = () => {
    const salary = spendingData?.find((val) => val.id === '0');
    const potPayments = spendingData?.filter((val) => val.id !== '0').reduce((prev, curr) => prev += +curr.amountString, 0) || 0;
    const color = salary?.colour || "green";
    const leftover = (salary?.amount || 0) - potPayments;
    return (
      <LeftoverText color={color}>
        You'll have £{leftover.toFixed(2)} leftover in your current account!
      </LeftoverText>
    )
  }

  const calculateSpendingBar = () => {
    if (!spendingData) {
      return null;
    }

    const salary = spendingData.find((val) => val.id === '0');
    const restSum = spendingData
      .filter((val) => val.id !== '0')
      .reduce((prev, curr) => (prev += +curr.amountString), 0);

    const spendingBarData = spendingData.map((value) => {
      const percent =
        value.id === '0'
          ? ((+value.amountString - restSum) / +value.amountString) * 100
          : (+value.amountString / +(salary?.amountString || 0)) * 100;
      return (
        <SpendingBarItem key={value.id} $percent={percent} color={value.colour}>
          {percent.toFixed(2)}%
        </SpendingBarItem>
      );
    });

    return spendingBarData;
  };

  const submitSalaryData = async (): Promise<void> => {
    await ApiConnector.put<employerInfo>('/employer', salaryData);
    setShowSalaryModal(false);
  }

  const submitSpendingData = async (): Promise<void> => {
    const validData = spendingData?.map(({ amountString, ...val }) => ({ ...val, amount: +amountString }));
    await ApiConnector.post<DedicatedFinance[]>('/finances', validData);
    setShowSpendingModal(false);
  };

  return loading ? (
    <LoadingContainer>
      <MoonLoader color={(theme as any).pink} size="80" title="Loading..." />
      <h1>Loading...</h1>
    </LoadingContainer>
  ) : (
    <DashContainer>
      <Modal
        show={showSalaryModal}
        onSubmit={submitSalaryData}
        onClose={() => {
          setShowSalaryModal(false);
        }}
        title="Update Salary Details"
      >
        <SalaryGroup>
          <Label>Employer Name</Label>
          <TextBox value={salaryData.name} onChange={(e) => setSalaryData((data) => ({ ...data, name: e.target.value }))} />
        </SalaryGroup>
        <SalaryGroup>
          <Label>Payday</Label>
          <TextBox disabled={salaryData.paidLastWorkingDay} value={salaryData.payDay} type='number' max={31} min={1} onChange={(e) => setSalaryData((data) => ({ ...data, payDay: e.target.valueAsNumber }))} />
        </SalaryGroup>
        <SalaryGroup>
          <Label>Paid On Holidays/Weekends</Label>
          <ToggleContainer>
            <Toggle
              disabled={salaryData.paidLastWorkingDay}
              value={salaryData.paidOnHolidays}
              onChange={(val) => setSalaryData((data) => ({ ...data, paidOnHolidays: val }))}
            />
          </ToggleContainer>

        </SalaryGroup>
        <SalaryGroup>
          <Label>Paid Last Working Day</Label>
          <ToggleContainer>
            <Toggle
              value={salaryData.paidLastWorkingDay}
              onChange={(val) => setSalaryData((data) => ({ ...data, paidLastWorkingDay: val }))}
            />
          </ToggleContainer>

        </SalaryGroup>
      </Modal>
      <Modal
        show={showSpendingModal}
        onSubmit={submitSpendingData}
        onClose={() => {
          setShowSpendingModal(false);
        }}
        title="Update Dedicated Spending"
      >
        <Group>
          <SpendingContainer>
            <SpendingBoxContainer>
              {spendingData &&
                spendingData.map((value) => (
                  <SpendingBox
                    key={value.id}
                    spendingValue={value}
                    onValueChange={(finance) => {
                      const itemIndex = spendingData.findIndex((val) => val.id === finance.id);
                      const newData = [...spendingData];
                      newData[itemIndex] = finance;
                      setSpendingData(newData);
                    }}
                  />
                ))}
            </SpendingBoxContainer>
          </SpendingContainer>
          <SpendingContainer style={{ alignItems: 'center' }}>
            <SpendingBar>{calculateSpendingBar()}</SpendingBar>
            {generateLeftoverText()}
          </SpendingContainer>
        </Group>
      </Modal>
      <Component>
        <Header>{new Date().toLocaleString('default', { month: 'long' })} Monthly Spending</Header>
        {chartData && (
          <FlexibleXYPlot
            yDomain={[0, chartData.reduce((prev, curr) => ((curr.amount || 0) > prev ? curr.amount || 0 : prev), 0)]}
            onMouseLeave={() => setHintValue(null)}
          >
            <HorizontalGridLines />
            <AreaSeries
              stroke={(theme as ThemeType).white}
              color={(theme as ThemeType).pink}
              getNull={(d) => d.y !== null}
              data={chartData.map((val) => ({ x: val.day, y: val.amount as any }))}
              onNearestXY={(v) => setHintValue(v)}
            />
            {hintValue && (
              <Hint value={hintValue}>
                <h3 style={{ background: (theme as ThemeType).white, color: (theme as ThemeType).pink }}>
                  Day {hintValue.x} - £{hintValue.y}
                </h3>
              </Hint>
            )}
            <XAxis style={{ fill: (theme as ThemeType).white }} />
            <YAxis style={{ fill: (theme as ThemeType).white }} />
          </FlexibleXYPlot>
        )}
      </Component>
      <Component>
        <Group>
          <Header>Transactions</Header>
          <Icon
            icon="keyboard_double_arrow_left"
            hidden={transactionIndex <= 0}
            disabled={transactionIndex <= 0}
            onClick={() => setTransactionIndex((val) => val - 1)}
          />
          <PageInput
            value={userTransactionIndex}
            onChange={changeUserTransactionIndex}
            onKeyUp={(ev) =>
              ev.key === 'Enter' && setTransactionIndex(+userTransactionIndex < 1 ? 0 : +userTransactionIndex - 1)
            }
          />
          <Icon
            icon="keyboard_double_arrow_right"
            hidden={transactionIndex * 5 + 5 >= transactions.length}
            disabled={transactionIndex * 5 + 5 >= transactions.length}
            onClick={() => setTransactionIndex((val) => val + 1)}
          />
        </Group>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.slice(transactionIndex * 5, transactionIndex * 5 + 5).map((transaction, indx) => {
              const date = moment(transaction.created);
              return (
                <TableRow key={transaction.id + indx}>
                  <TableCell>
                    <TableLogo src={transaction.logoUrl || '/icon-192x192.png'} />
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'incoming' ? '+' : '-'}£{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{date.format('MMM Do YYYY, hh:mm A')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Component>
    </DashContainer>
  );
};
