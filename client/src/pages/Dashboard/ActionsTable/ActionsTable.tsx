/* eslint-disable object-property-newline */
import React, { useState, MouseEvent, ChangeEvent } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { StyledTable, StyledTableContainer, TableBox, TablePaper, TableTitle } from './ActionsTable.styled';
import moment from 'moment';
import { AutomationRecord } from '../../../interfaces';

type SortResult = 0 | 1 | -1;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): SortResult {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof never>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string | Date }, b: { [key in Key]: number | string | Date }) => number {
  return order === 'desc'
    ? (a, b): SortResult => descendingComparator(a, b, orderBy)
    : (a, b): SortResult => -descendingComparator(a, b, orderBy) as SortResult;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof AutomationRecord;
  label: string;
  numeric: boolean;
  date: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    date: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'name',
    numeric: false,
    date: false,
    disablePadding: false,
    label: 'Action Name',
  },
  {
    id: 'lastRan',
    numeric: false,
    date: true,
    disablePadding: false,
    label: 'Last Ran',
  },
  {
    id: 'createdAt',
    numeric: false,
    date: true,
    disablePadding: false,
    label: 'Created At',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown>, property: keyof AutomationRecord) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps): JSX.Element {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof AutomationRecord) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export const ActionsTable = ({
  actions,
  onDeleteRecords,
  onAddRecord,
}: {
  actions: AutomationRecord[];
  onDeleteRecords: (ids: number[]) => Promise<boolean>;
  onAddRecord: () => void;
}): JSX.Element => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof AutomationRecord>('id');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps): JSX.Element => {
    const { numSelected } = props;

    const handleDelete = async (): Promise<void> => {
      const successDelete = await onDeleteRecords(selected);
      if (successDelete) {
        setSelected([]);
      }
    };

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <TableTitle color="inherit" variant="subtitle1">
            {numSelected} selected
          </TableTitle>
        ) : (
          <TableTitle variant="h6" id="tableTitle">
            Actions
          </TableTitle>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add">
            <IconButton onClick={onAddRecord}>
              <Add />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof AutomationRecord): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      const newSelecteds = actions.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: MouseEvent<unknown>, id: number): void => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number): boolean => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - actions.length) : 0;

  const renderRow = (row: AutomationRecord, index: number): JSX.Element => {
    const isItemSelected = isSelected(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRow
        hover
        onClick={(event): void => handleClick(event, row.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </TableCell>
        {headCells.map((cell, index) => {
          const cellData = cell.date ? moment(row[cell.id]).format('DD-MM-YYYY HH:mm:ss') : row[cell.id];
          return index === 0 ? (
            <TableCell key={cell.id} component="th" id={labelId} scope="row" padding="none">
              {cellData}
            </TableCell>
          ) : (
            <TableCell key={cell.id}>{cellData}</TableCell>
          );
        })}
      </TableRow>
    );
  };

  return (
    <TableBox>
      <TablePaper>
        <EnhancedTableToolbar numSelected={selected.length} />
        <StyledTableContainer>
          <StyledTable aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={actions.length}
            />
            <TableBody>
              {actions
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(renderRow)}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={actions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TablePaper>
    </TableBox>
  );
};
