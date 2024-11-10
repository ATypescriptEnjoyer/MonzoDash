import {
  Avatar,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Transaction } from '../../../shared/interfaces/transaction';
import { Icon } from './Icon';
import moment from 'moment';
import { useState } from 'react';

interface Props {
  data: Transaction[];
  page: number;
  onPageChange: (newPage: number) => void;
  count: number;
}

export const Transactions = (props: Props) => {
  const { data, onPageChange, page, count } = props;

  const [innerPage, setInnerPage] = useState(page);

  return (
    <Stack flex={1} height="100%">
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography variant="h5" width="100%">
          Transactions
        </Typography>
        <Icon icon="keyboard_double_arrow_left" disabled={page === 1} onClick={() => onPageChange(page - 1)} />
        <TextField
          sx={{ width: '100px' }}
          value={innerPage}
          type="tel"
          onChange={(ev) => setInnerPage(+ev.target.value)}
          onKeyUp={(ev) => ev.key === 'Enter' && onPageChange(innerPage)}
        />
        <Icon icon="keyboard_double_arrow_right" disabled={page * 5 >= count} onClick={() => onPageChange(page + 1)} />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflowY: 'auto' }}>
          {data.map((transaction, indx) => (
            <TableRow key={transaction.id + indx}>
              <TableCell>
                <Stack direction="row" alignItems="center" gap={4}>
                  <Avatar src={transaction.logoUrl || '/icon-192x192.png'} />
                  {transaction.description}
                </Stack>
              </TableCell>
              <TableCell>
                {transaction.type === 'incoming' ? '+' : '-'}£{transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>{moment(transaction.created).format('MMM Do YYYY, hh:mm A')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};
