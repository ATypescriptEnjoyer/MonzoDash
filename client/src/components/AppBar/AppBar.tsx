import { useState } from 'react';
import { GetAppName, GetAppVersion } from '../../utils';
import { Icon } from '../';
import { DesktopOnlyIcon, Link, Logo, Splitter, Tablet, TabletItem } from './AppBar.styled';
import { publish, EVENT_TYPES } from '../../event';
import { CurrentFinances } from '../../../../shared/interfaces/finances';
import { Stack } from '@mui/material';
import { useMutation, useQuery } from '../../api';
import { Loader } from '../Loader';

export const AppBar = (): JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false);
  const finances = useQuery<CurrentFinances>('finances/current');
  const logoutMutation = useMutation('auth/signout', { method: 'POST' });

  const financesElement = () => {
    return finances.data ? (
      <Tablet>
        <TabletItem>
          £{(finances.data.balancePence / 100).toFixed(2)} / {finances.data.daysTilPay} days
        </TabletItem>
        <Splitter />
        <TabletItem>£{(finances.data.perDayPence / 100).toFixed(2)} / day</TabletItem>
      </Tablet>
    ) : (
      <Tablet>
        <TabletItem>Loading</TabletItem>
        <Splitter />
        <TabletItem>Finance Data</TabletItem>
      </Tablet>
    );
  };

  const onUpdateDedicatedSpending = () => {
    publish(EVENT_TYPES.DEDICATED_SPENDING_OPEN, null);
    setVisible(false);
  };

  return finances.isFetching ? (
    <Loader />
  ) : (
    <>
      <Stack sx={{ display: { xs: 'flex', md: 'none' } }}>
        <Icon icon="menu" onClick={() => setVisible(!visible)} />
        {financesElement()}
        <Icon icon="logout" onClick={() => logoutMutation.mutate({}, { onSuccess: () => (location.href = '/') })} />
      </Stack>
      <Stack
        sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', height: '95px' }}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Logo
          src="/logo.png"
          alt={`${GetAppName()} v${GetAppVersion()}`}
          title={`${GetAppName()} v${GetAppVersion()}`}
        />
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Link onClick={() => publish(EVENT_TYPES.SALARY_DETAILS_OPEN, null)}>Update Salary Details</Link>
          {financesElement()}
          <Link onClick={onUpdateDedicatedSpending}>Update Dedicated Spending</Link>
        </Stack>
        <DesktopOnlyIcon
          icon="logout"
          onClick={() =>
            logoutMutation.mutate(
              {},
              {
                onSuccess: () => {
                  location.href = '/';
                },
              },
            )
          }
        />
      </Stack>
    </>
  );
};
