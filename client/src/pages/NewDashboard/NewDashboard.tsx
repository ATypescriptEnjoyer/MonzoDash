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
} from './NewDashboard.styled';
import { Owner } from '../../../../shared/interfaces/monzo';
import { DedicatedFinance, CurrentFinances } from '../../../../shared/interfaces/finances';
import { Transaction } from '../../../../shared/interfaces/transaction';
import { ApiConnector } from '../../network';
import { MoonLoader } from 'react-spinners';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, FlexibleXYPlot, AreaSeries } from 'react-vis';
import { useTheme } from 'styled-components';
import { ThemeType } from '../..';
import moment from 'moment';
import { Icon } from '../../components';

interface Employer {
  name: string;
  payDay: number;
}

export const NewDashboard = (): JSX.Element => {
  const [transactionIndex, setTransactionIndex] = useState<number>(0);
  const [userTransactionIndex, setUserTransactionIndex] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartData, setChartDate] = useState<{ day: number; amount: number }[]>([]);
  const theme = useTheme();

  useEffect(() => {
    setUserTransactionIndex(`${transactionIndex + 1}`);
  }, [transactionIndex]);

  useEffect(() => {
    const getMonthlySpend = async (): Promise<void> => {
      const now = moment();
      const { data } = await ApiConnector.get<{ day: number; month: number; year: number; amount: number }[]>(
        `/DailyReport/by-date/${now.year()}/${now.month() + 1}`,
      );
      const labels = Array.from(new Array(moment().daysInMonth() + 1).keys()).splice(1);
      const datesData = labels.map((val) => {
        const datesAmount = data.find((value) => value.day === val);
        return { day: val, amount: datesAmount ? datesAmount.amount : 0 };
      });
      setChartDate(datesData);
    };

    const getTransactions = async (): Promise<void> => {
      const { data } = await ApiConnector.get<Transaction[]>('/transactions');
      setTransactions(data);
    };
    Promise.all([getMonthlySpend(), getTransactions()]).then(() => setLoading(false));
  }, []);

  const changeUserTransactionIndex = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(+ev.currentTarget.value)) {
      setUserTransactionIndex(ev.currentTarget.value);
    }
  };

  return loading ? (
    <LoadingContainer>
      <MoonLoader color="#F8C8DC" size="80" title="Loading..." />
      <h1>Loading...</h1>
    </LoadingContainer>
  ) : (
    <DashContainer>
      <Component>
        <Header>{new Date().toLocaleString('default', { month: 'long' })} Monthly Spending</Header>
        {chartData && (
          <FlexibleXYPlot ty>
            <HorizontalGridLines />
            <AreaSeries
              stroke={(theme as ThemeType).white}
              color={(theme as ThemeType).pink}
              data={chartData.map((val) => ({ x: val.day, y: val.amount }))}
            />
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
