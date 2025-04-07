import { Menu as MenuIcon } from '@mui/icons-material';
import {
  Avatar,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Transaction } from '@monzodash/api/transactions/transactions.interfaces';
import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu';
import { useInfiniteQuery, useMutation, useQuery } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingTransactions } from './LoadingTransactions';

interface PotPaymentRequest {
  transactionId: string;
  potId: string;
}

interface PotPayment {
  id: string;
  groupId: string;
  potId: string;
}

export const Transactions = () => {
  const queryClient = useQueryClient();
  const pots = useQuery<Record<string, string>>('monzo/pots');
  const potPayments = useQuery<PotPayment[]>('potpayments');
  const createPotPayment = useMutation<PotPayment, PotPaymentRequest>('potpayments', { method: 'PUT' });
  const deletePotPayment = useMutation<boolean, string>('potpayments', { method: 'DELETE', dataIsParam: true });

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery<{
    data: Transaction[];
    pagination: { page: number; count: number };
  }>(`transactions`, {
    getNextPageParam: (firstPage) =>
      firstPage.pagination.page * 20 < firstPage.pagination.count ? firstPage.pagination.page + 1 : undefined,
    getPreviousPageParam: (lastPage) => (lastPage.pagination.page > 1 ? lastPage.pagination.page - 1 : undefined),
  });

  const onTableScroll = (scroll: React.UIEvent<HTMLDivElement>) => {
    const totalScroll = scroll.currentTarget.scrollTop + scroll.currentTarget.offsetHeight;
    if (
      scroll.currentTarget.scrollHeight - scroll.currentTarget.scrollHeight / 10 < totalScroll &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  };

  const exportTransactions = useMutation<Transaction[], string>('transactions/export', {
    method: 'POST',
    dataIsParam: true,
  });

  const handlePayFromPot = (transactionId: string, potId: string) => {
    createPotPayment.mutate(
      { transactionId, potId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['potpayments'] });
        },
      },
    );
  };

  const handleDeletePotPayment = (id: string) => {
    deletePotPayment.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['potpayments'] });
      },
    });
  };

  const handleExport = () => {
    const from = dayjs().startOf('month').format('YYYY-MM-DD');
    const to = dayjs().format('YYYY-MM-DD');
    const fileName = `monzodash-export-${from}-${to}`;

    exportTransactions.mutate(`${from}/${to}`, {
      onSuccess: (response) => {
        const jsonData = new Blob([JSON.stringify(response)], { type: 'application/json' });
        const jsonURL = URL.createObjectURL(jsonData);
        const link = document.createElement('a');
        link.href = jsonURL;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    });
  };

  const detailedTransactions = useMemo(() => {
    if (!data) return [];
    return data.pages
      .reduce((prev, curr) => [...prev, ...curr.data], [] as Transaction[])
      .map((transaction) => {
        const potPayment = potPayments.data?.find((potPayment) => potPayment.groupId === transaction.groupId);
        return {
          ...transaction,
          potName: potPayment && pots.data ? pots.data[potPayment.potId] : null,
          potPaymentId: potPayment?.id,
        };
      });
  }, [data, potPayments.data, pots.data]);

  return (
    <Stack height="100%">
      <Paper sx={{ height: '100%' }}>
        <Stack flex={1} direction="row" gap={2}>
          <Typography variant="h5">Transactions</Typography>
          <Button variant="outlined" onClick={handleExport}>
            Export
          </Button>
        </Stack>
        <TableContainer
          sx={{ height: { xs: 600, md: 'calc(100% - 60px)' }, overflowX: { xs: 'auto', md: 'auto' } }}
          onScroll={onTableScroll}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? (
                detailedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={4}>
                        <Avatar src={transaction.logoUrl || '/icon-192x192.png'} />
                        <Stack>
                          <Typography variant="body1">{transaction.description}</Typography>
                          {transaction.potName && (
                            <Typography variant="caption">Being paid from {transaction.potName}</Typography>
                          )}
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {transaction.type === 'incoming' ? '+' : '-'}£{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{dayjs(transaction.created).format('MMM D YYYY, hh:mm A')}</TableCell>
                    <TableCell>
                      {!transaction.internal && pots.data && (
                        <Menu
                          theming="dark"
                          menuButton={
                            <IconButton>
                              <MenuIcon />
                            </IconButton>
                          }
                        >
                          <SubMenu label="Pay Future Payments From Pot">
                            {Object.keys(pots.data).map((pot) => (
                              <MenuItem key={pot} onClick={() => handlePayFromPot(transaction.id, pot)}>
                                {pots.data[pot]}
                              </MenuItem>
                            ))}
                          </SubMenu>
                          {transaction.potPaymentId && (
                            <MenuItem onClick={() => handleDeletePotPayment(transaction.potPaymentId as string)}>
                              Stop paying from pot
                            </MenuItem>
                          )}
                        </Menu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <LoadingTransactions />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
};
