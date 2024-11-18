import { TableRow, TableCell, Stack, Avatar, Skeleton, Typography } from '@mui/material';

export const LoadingTransactions = () =>
  Array.from(new Array(5).keys()).map((key) => (
    <TableRow key={key}>
      <TableCell>
        <Stack direction="row" alignItems="center" gap={4}>
          <Avatar>
            <Skeleton />
          </Avatar>
          <Typography variant="body1">
            <Skeleton width={200} />
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  ));
