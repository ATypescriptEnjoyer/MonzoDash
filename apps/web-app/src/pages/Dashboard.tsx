import { Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { JSX, useState } from 'react';
import { Finance } from '@monzodash/api/finances/finances.interfaces';
import { useMutation, useQuery } from '../api';
import { AppBar } from '../components/AppBar';
import { Chart } from '../components/Chart';
import { SalaryData, SalaryModal } from '../components/SalaryModal';
import { SpendingModal } from '../components/SpendingModal';
import { Transactions } from '../components/Transactions/Transactions';
import { Chat } from '../components/Chat/Chat';

export const Dashboard = (): JSX.Element => {
  const queryClient = useQueryClient();

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);

  const employer = useQuery<SalaryData>('employer');
  const mutateEmployer = useMutation<SalaryData, SalaryData>('employer');

  const finance = useQuery<Finance[]>('finances');
  const mutateFinance = useMutation<Finance[], Finance[]>('finances', { method: 'POST' });

  const [chartDate, setChartDate] = useState<{ month: number; year: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const chart = useQuery<{ month: number; year: number; data: { [k: number]: number } }>(
    `daily-report/by-date/${chartDate.year}/${chartDate.month}`,
    {
      keepPreviousData: true,
    },
  );

  return (
    <Stack height="100vh" padding={(theme) => ({ xs: theme.spacing(0, 1), md: theme.spacing(0, 4) })}>
      <AppBar
        onShowDedicatedSpending={() => setShowSpendingModal(true)}
        onShowSalary={() => setShowSalaryModal(true)}
      />
      <Stack height="calc(100vh - 95px)" gap={4} padding={(theme) => theme.spacing(2, 0)}>
        <SalaryModal
          key={employer.data?.id}
          isLoading={employer.isLoading}
          data={employer.data ? { ...employer.data, salary: employer.data.salary / 100 } : undefined}
          onClose={() => setShowSalaryModal(false)}
          open={showSalaryModal}
          onSubmit={(data) =>
            mutateEmployer.mutate({ ...data, salary: data.salary * 100 }, {
              onSuccess: () => {
                setShowSalaryModal(false);
                queryClient.invalidateQueries({ queryKey: ['employer'] });
              },
            })
          }
        />
        <SpendingModal
          salary={employer.data?.salary ? employer.data.salary / 100 : 0}
          open={showSpendingModal}
          isLoading={finance.isLoading}
          onClose={() => setShowSpendingModal(false)}
          data={finance.data?.map((finance) => ({ ...finance, items: finance.items.map((item) => ({ ...item, amount: (item.amount / 100).toFixed(2) })) }))}
          onSubmit={(data) =>
            mutateFinance.mutate(data.map((finance) => ({ ...finance, items: finance.items.map((item) => ({ ...item, amount: (+item.amount * 100) })) })), {
              onSuccess: () => {
                setShowSpendingModal(false);
                queryClient.invalidateQueries({ queryKey: ['finances'] });
              },
            })
          }
        />
        <Stack
          sx={{ height: { xs: 'initial', md: '100%' }, flexDirection: { xs: 'column-reverse', md: 'row' } }}
          gap={4}
        >
          <Stack sx={{ flex: { xs: 'initial', md: 0.3 } }}>
            <Transactions />
          </Stack>
          <Stack sx={{ flex: { xs: 'initial', md: 0.7 } }} gap={4}>
            <Chart
              isLoading={chart.isLoading}
              onChangeDate={(month, year) => setChartDate({ month, year })}
              data={chart.data ?? { data: [], ...chartDate }}
            />
            <Chat />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
