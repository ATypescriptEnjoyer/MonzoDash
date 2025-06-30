import { Download, Menu as MenuIcon, Search } from '@mui/icons-material';
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
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Transaction } from '@monzodash/api/transactions/transactions.interfaces';
import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu';
import { useInfiniteQuery, useMutation, useQuery } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingTransactions } from './LoadingTransactions';
import { useDebounce } from '@uidotdev/usehooks';

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
  const deleteTransaction = useMutation<boolean, string>('transactions', { method: 'DELETE', dataIsParam: true });

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 300);
  const [internal, setInternal] = useState(false);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery<{
    data: Transaction[];
    pagination: { page: number; count: number };
  }>(`transactions`, {
    getNextPageParam: (firstPage) =>
      firstPage.pagination.page * 20 < firstPage.pagination.count ? firstPage.pagination.page + 1 : undefined,
    getPreviousPageParam: (lastPage) => (lastPage.pagination.page > 1 ? lastPage.pagination.page - 1 : undefined),
    data:
      debounceSearch.trim().length > 0
        ? {
          search: debounceSearch,
          withInternal: internal.toString(),
        }
        : { withInternal: internal.toString() },
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

  const handleDeleteTransaction = (id: string) => {

    deleteTransaction.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
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
        <Typography variant="h5">Transactions</Typography>
        <Stack flex={1} direction="row" gap={2} justifyContent="space-between" alignItems="center">
          <FormControlLabel control={<Checkbox checked={internal} onChange={(event) => setInternal(event.target.checked)} />} label="Show Internal Transactions" />
          <Stack direction="row" gap={1}>
            <Button
              sx={{ minWidth: 0 }}
              variant="outlined"
              startIcon={<Search />}
              onClick={() => setShowSearch((search) => !search)}
            />
            {showSearch && (
              <TextField
                autoFocus
                slotProps={{
                  input: { sx: { height: '100%' } },
                  htmlInput: { sx: { padding: (theme) => theme.spacing(0, 0, 0, 2), height: '100%' } },
                }}
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            )}
            <Button sx={{ minWidth: 0 }} variant="outlined" startIcon={<Download />} onClick={handleExport} />
          </Stack>
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
                      <Menu
                        theming="dark"
                        menuButton={
                          <IconButton>
                            <MenuIcon />
                          </IconButton>
                        }
                      >
                        {pots.data &&
                          <SubMenu label="Pay Future Payments From Pot">
                            {Object.keys(pots.data).map((pot) => (
                              <MenuItem key={pot} onClick={() => handlePayFromPot(transaction.id, pot)}>
                                {pots.data[pot]}
                              </MenuItem>
                            ))}
                          </SubMenu>}
                        <MenuItem onClick={() => handleDeleteTransaction(transaction.id)}>
                          Delete
                        </MenuItem>
                        {transaction.potPaymentId && (
                          <MenuItem onClick={() => handleDeletePotPayment(transaction.potPaymentId as string)}>
                            Stop paying from pot
                          </MenuItem>
                        )}
                      </Menu>
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
