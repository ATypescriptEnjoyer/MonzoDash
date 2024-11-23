import { ChevronLeft, ChevronRight, Menu as MenuIcon } from '@mui/icons-material';
import {
  Avatar,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { Transaction } from '@monzodash/api/transactions/transactions.interfaces';
import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu';
import { useMutation, useQuery } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingTransactions } from './LoadingTransactions';

interface Props {
  data?: {
    data: Transaction[];
    pagination: {
      page: number;
      count: number;
    };
  };
  page: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

interface PotPaymentRequest {
  transactionId: string;
  potId: string;
}

interface PotPayment {
  id: string;
  groupId: string;
  potId: string;
}

export const Transactions = (props: Props) => {
  const queryClient = useQueryClient();
  const { data, onPageChange, page, isLoading } = props;
  const [innerPage, setInnerPage] = useState(page);
  const pots = useQuery<Record<string, string>>('monzo/pots');
  const potPayments = useQuery<PotPayment[]>('potpayments');
  const createPotPayment = useMutation<PotPayment, PotPaymentRequest>('potpayments', { method: 'PUT' });
  const deletePotPayment = useMutation<boolean, string>('potpayments', { method: 'DELETE', dataIsParam: true });

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

  const detailedTransactions = useMemo(() => {
    if (!data) return [];
    return data.data.map((transaction) => {
      const potPayment = potPayments.data?.find((potPayment) => potPayment.groupId === transaction.groupId);
      return {
        ...transaction,
        potName: potPayment && pots.data ? pots.data[potPayment.potId] : null,
        potPaymentId: potPayment?.id,
      };
    });
  }, [data, potPayments.data, pots.data]);

  return (
    <Stack flex={1} sx={{ height: '1px' }}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Stack flex={1} direction="row" gap={2}>
          <Typography variant="h5">Transactions</Typography>
          <Button variant="outlined">Export</Button>
        </Stack>
        <IconButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
        </IconButton>
        <TextField
          sx={{ width: '100px' }}
          value={innerPage}
          type="tel"
          onChange={(ev) => setInnerPage(+ev.target.value)}
          onKeyUp={(ev) => ev.key === 'Enter' && onPageChange(innerPage)}
        />
        <IconButton disabled={!data || page * 5 >= data.pagination.count} onClick={() => onPageChange(page + 1)}>
          <ChevronRight />
        </IconButton>
      </Stack>
      <TableContainer sx={{ overflowX: { xs: 'visible', md: 'auto' } }}>
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
                  <TableCell>{moment(transaction.created).format('MMM Do YYYY, hh:mm A')}</TableCell>
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
    </Stack>
  );
};
