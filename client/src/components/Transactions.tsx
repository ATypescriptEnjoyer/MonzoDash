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

interface Props {
  data: Transaction[];
  page: number;
  onPageChange: (newPage: number) => void;
}

export const Transactions = (props: Props) => {
  const { data, onPageChange, page } = props;
  return (
    <Stack flex={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h5" width="100%">
          Transactions
        </Typography>
        <Icon icon="keyboard_double_arrow_left" disabled={page === 1} onClick={() => onPageChange(page - 1)} />
        <Input value={page} type="number" inputProps={{ min: 1 }} onChange={(ev) => onPageChange(+ev.target.value)} />
        <Icon
          icon="keyboard_double_arrow_right"
          disabled={page * 5 >= data.length}
          onClick={() => onPageChange(page + 1)}
        />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((transaction, indx) => {
            const date = moment(transaction.created);
            return (
              <TableRow key={transaction.id + indx}>
                <TableCell>
                  <Avatar src={transaction.logoUrl || '/icon-192x192.png'} />
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
    </Stack>
  );
};
