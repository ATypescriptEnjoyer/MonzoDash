import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Avatar,
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
import { Transaction } from '../../../shared/interfaces/transaction';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Menu, MenuItem, SubMenu } from '@szhsin/react-menu';
import { useMutation, useQuery } from '../api';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  data: Transaction[];
  page: number;
  onPageChange: (newPage: number) => void;
  count: number;
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
  const { data, onPageChange, page, count } = props;
  const [innerPage, setInnerPage] = useState(page);
  const pots = useQuery<Record<string, string>>('monzo/pots');
  const potPayments = useQuery<PotPayment[]>('potpayments');
  const createPotPayment = useMutation<PotPayment, PotPaymentRequest>('potpayments', { method: 'PUT' });

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

  const detailedTransactions = useMemo(
    () =>
      data.map((transaction) => {
        const potPayment = potPayments.data?.find((potPayment) => potPayment.groupId === transaction.groupId);
        return { ...transaction, potName: potPayment && pots.data ? pots.data[potPayment.potId] : null };
      }),
    [data, potPayments.data, pots.data],
  );

  return (
    <Stack flex={1} sx={{ height: '1px' }}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography variant="h5" width="100%">
          Transactions
        </Typography>
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
        <IconButton disabled={page * 5 >= count} onClick={() => onPageChange(page + 1)}>
          <ChevronRight />
        </IconButton>
      </Stack>
      <TableContainer>
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
            {detailedTransactions.map((transaction, indx) => (
              <TableRow key={transaction.id + indx}>
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
                    </Menu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
