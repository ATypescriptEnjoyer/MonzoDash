import { Logout, Menu } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { CurrentFinances } from '@api/finances/finances.interfaces';
import { useMutation, useQuery } from '../api';
import { colours } from '../theme';
import { GetAppName, GetAppVersion } from '../utils';

const FinanceText = styled(Typography)({
  fontWeight: 'bold',
  textAlign: 'center',
});

const Link = styled(Typography)`
  color: ${colours.lightGrey};
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 2px solid ${colours.lightGrey};
  transition: all 0.25s ease-in-out;

  &:hover {
    color: ${colours.pink};
    border-bottom: 2px solid ${colours.blue};
  }
`;

interface Props {
  onShowSalary: () => void;
  onShowDedicatedSpending: () => void;
}

export const AppBar = (props: Props): JSX.Element => {
  const { onShowDedicatedSpending, onShowSalary } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const finances = useQuery<CurrentFinances>('finances/current');
  const logoutMutation = useMutation('auth/signout', { method: 'POST' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const moneyLeft = useMemo(
    () =>
      finances.data ? (
        <Stack>
          <FinanceText>
            £{(finances.data.balancePence / 100).toFixed(2)} / {finances.data.daysTilPay} days
          </FinanceText>
          <Divider sx={{ background: colours.blue }} />
          <FinanceText>£{(finances.data.perDayPence / 100).toFixed(2)} / day</FinanceText>
        </Stack>
      ) : (
        <Stack>
          <FinanceText>Loading</FinanceText>
          <Divider />
          <FinanceText>Finance Data</FinanceText>
        </Stack>
      ),
    [finances],
  );

  const logoutButton = (
    <IconButton onClick={() => logoutMutation.mutate({}, { onSuccess: () => (location.href = '/') })}>
      <Logout />
    </IconButton>
  );

  return (
    <>
      <Stack
        direction="row"
        sx={(theme) => ({ display: { xs: 'flex', md: 'none' }, padding: theme.spacing(2) })}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <IconButton onClick={() => setVisible(!visible)}>
          <Menu />
        </IconButton>
        {moneyLeft}
        {logoutButton}
      </Stack>

      <Stack
        sx={(theme) => ({ display: visible && isMobile ? 'flex' : 'none', padding: theme.spacing(2) })}
        direction="column"
        alignItems="center"
        justifyContent="space-evenly"
        gap={2}
      >
        <Link onClick={onShowSalary}>Update Salary Details</Link>
        <Link onClick={onShowDedicatedSpending}>Update Dedicated Spending</Link>
      </Stack>

      <Stack
        sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', height: '95px' }}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box
          width="50px"
          component="img"
          src="/logo.png"
          alt={`${GetAppName()} v${GetAppVersion()}`}
          title={`${GetAppName()} v${GetAppVersion()}`}
        />
        <Stack direction="row" alignItems="center" justifyContent="center" gap={4}>
          <Link onClick={onShowSalary}>Update Salary Details</Link>
          {moneyLeft}
          <Link onClick={onShowDedicatedSpending}>Update Dedicated Spending</Link>
        </Stack>
        {logoutButton}
      </Stack>
    </>
  );
};
