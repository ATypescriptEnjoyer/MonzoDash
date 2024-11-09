import { useState, useEffect } from 'react';
import { Transaction } from '../../../shared/interfaces/transaction';
import { subscribe, unsubscribe, EVENT_TYPES } from '../event';
import { DedicatedFinance } from '../../../shared/interfaces/finances';
import { Loader } from '../components/Loader';
import { SalaryData, SalaryModal } from '../components/SalaryModal';
import { useMutation, useQuery } from '../network/api';
import { useQueryClient } from '@tanstack/react-query';
import { Stack } from '@mui/material';
import { SpendingModal } from '../components/SpendingModal';
import { Transactions } from '../components/Transactions';
import { Chart } from '../components/Chart';

export const NewDashboard = (): JSX.Element => {
  const queryClient = useQueryClient();

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);

  useEffect(() => {
    const showSalary = () => setShowSalaryModal(true);
    const showSpending = () => setShowSpendingModal(true);

    subscribe(EVENT_TYPES.SALARY_DETAILS_OPEN, showSalary);
    subscribe(EVENT_TYPES.DEDICATED_SPENDING_OPEN, showSpending);

    return () => {
      unsubscribe(EVENT_TYPES.SALARY_DETAILS_OPEN, showSalary);
      unsubscribe(EVENT_TYPES.DEDICATED_SPENDING_OPEN, showSpending);
    };
  }, []);

  const employer = useQuery<SalaryData>('employer');
  const mutateEmployer = useMutation<SalaryData, SalaryData>('employer');

  const finance = useQuery<DedicatedFinance[]>('finances');
  const mutateFinance = useMutation<DedicatedFinance[], DedicatedFinance[]>('finances', { method: 'POST' });

  const chart = useQuery<{ month: number; year: number; data: { [k: number]: number } }>(
    `daily-report/by-date/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
  );

  const [page, setPage] = useState(1);
  const transactions = useQuery<Transaction[]>('transactions');

  return employer.isFetching ? (
    <Loader />
  ) : (
    <Stack direction="column">
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
      {chart.data && <Chart data={chart.data} />}
      {transactions.data && <Transactions data={transactions.data} page={page} onPageChange={setPage} />}
    </Stack>
  );
};
