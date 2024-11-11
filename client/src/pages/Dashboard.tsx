import { Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DedicatedFinance } from '../../../shared/interfaces/finances';
import { Transaction } from '../../../shared/interfaces/transaction';
import { useMutation, useQuery } from '../api';
import { AppBar } from '../components/AppBar';
import { Chart } from '../components/Chart';
import { Loader } from '../components/Loader';
import { SalaryData, SalaryModal } from '../components/SalaryModal';
import { SpendingModal } from '../components/SpendingModal';
import { Transactions } from '../components/Transactions';

export const Dashboard = (): JSX.Element => {
  const queryClient = useQueryClient();

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);

  const employer = useQuery<SalaryData>('employer');
  const mutateEmployer = useMutation<SalaryData, SalaryData>('employer');

  const finance = useQuery<DedicatedFinance[]>('finances');
  const mutateFinance = useMutation<DedicatedFinance[], DedicatedFinance[]>('finances', { method: 'POST' });

  const [chartDate, setChartDate] = useState<{ month: number; year: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const chart = useQuery<{ month: number; year: number; data: { [k: number]: number } }>(
    `daily-report/by-date/${chartDate.year}/${chartDate.month}`,
  );

  const [page, setPage] = useState(1);
  const transactions = useQuery<{ data: Transaction[]; pagination: { page: number; count: number } }>(
    `transactions?page=${page}`,
  );

  return (
    <Stack height="100vh" padding={(theme) => theme.spacing(0, 4)}>
      <AppBar
        onShowDedicatedSpending={() => setShowSpendingModal(true)}
        onShowSalary={() => setShowSalaryModal(true)}
      />
      {employer.isFetching ? (
        <Loader />
      ) : (
        <Stack direction="column" height="calc(100vh - 95px)">
          {employer.data && (
            <SalaryModal
              data={employer.data}
              onClose={() => setShowSalaryModal(false)}
              open={showSalaryModal}
              onSubmit={(data) =>
                mutateEmployer.mutate(data, {
                  onSuccess: () => {
                    setShowSalaryModal(false);
                    queryClient.invalidateQueries({ queryKey: ['employer'] });
                  },
                })
              }
            />
          )}
          {finance.data && (
            <SpendingModal
              open={showSpendingModal}
              onClose={() => setShowSpendingModal(false)}
              data={finance.data}
              onSubmit={(data) =>
                mutateFinance.mutate(data, {
                  onSuccess: () => {
                    setShowSpendingModal(false);
                    queryClient.invalidateQueries({ queryKey: ['finances'] });
                  },
                })
              }
            />
          )}
          {chart.data && <Chart onChangeDate={(month, year) => setChartDate({ month, year })} data={chart.data} />}
          {transactions.data && (
            <Transactions
              key={page}
              data={transactions.data.data}
              count={transactions.data.pagination.count}
              page={page}
              onPageChange={setPage}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};
