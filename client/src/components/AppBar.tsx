import { useMemo, useState } from 'react';
import { GetAppName, GetAppVersion } from '../utils';
import { Icon } from '.';
import { publish, EVENT_TYPES } from '../event';
import { CurrentFinances } from '../../../shared/interfaces/finances';
import { Box, Divider, Stack, styled, Typography } from '@mui/material';
import { useMutation, useQuery } from '../api';
import { Loader } from './Loader';
import { colours } from '../theme';

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

export const AppBar = (): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const finances = useQuery<CurrentFinances>('finances/current');
  const logoutMutation = useMutation('auth/signout', { method: 'POST' });

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

  const onUpdateSalaryDetails = () => {
    publish(EVENT_TYPES.SALARY_DETAILS_OPEN, null);
  };

  const onUpdateDedicatedSpending = () => {
    publish(EVENT_TYPES.DEDICATED_SPENDING_OPEN, null);
  };

  const logoutButton = (
    <Icon icon="logout" onClick={() => logoutMutation.mutate({}, { onSuccess: () => (location.href = '/') })} />
  );

  return finances.isFetching ? (
    <Loader />
  ) : (
    <>
      <Stack
        direction="row"
        sx={(theme) => ({ display: { xs: 'flex', md: 'none' }, padding: theme.spacing(2) })}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Icon icon="menu" onClick={() => setVisible(!visible)} />
        {moneyLeft}
        {logoutButton}
      </Stack>

      <Stack
        sx={(theme) => ({ display: visible ? 'flex' : 'none', padding: theme.spacing(2) })}
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
      >
        <Link onClick={onUpdateSalaryDetails}>Update Salary Details</Link>
        <Link onClick={onUpdateDedicatedSpending}>Update Dedicated Spending</Link>
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
          <Link onClick={onUpdateSalaryDetails}>Update Salary Details</Link>
          {moneyLeft}
          <Link onClick={onUpdateDedicatedSpending}>Update Dedicated Spending</Link>
        </Stack>
        {logoutButton}
      </Stack>
    </>
  );
};
