import React, { useEffect, useState } from 'react';
import { GetAppName, GetAppVersion } from '../../utils';
import { Icon } from '../';
import { DesktopOnlyIcon, Group, Link, Logo, MobileGroup, MobileOnlyIcon, Splitter, StyledHeader, Tablet, TabletItem } from './AppBar.styled';
import { ApiConnector } from '../../network';
import { publish, EVENT_TYPES } from '../../event';
import { CurrentFinances } from '../../../../shared/interfaces/finances';
import axios from 'axios';

export const AppBar = (): JSX.Element => {
  const [finances, setFinances] = useState<CurrentFinances>();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const getPerDayData = async (): Promise<void> => {
      try {
        const { data } = await ApiConnector.get<CurrentFinances>(`/finances/current`);
        setFinances(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 403) {
            await HandleSignOutClick();
          }
        }
      }
    };
    getPerDayData();
  }, []);

  const HandleSignOutClick = async (): Promise<void> => {
    try {
      await ApiConnector.post('/auth/signout');
    } catch (error) {
      console.error(error);
    }
    window.location.href = '/login';
  };

  const financesElement = (mobile?: boolean) => {
    return finances ? (
      <Tablet $isMobile={mobile}>
        <TabletItem>
          £{(finances.balancePence / 100).toFixed(2)} / {finances.daysTilPay} days
        </TabletItem>
        <Splitter />
        <TabletItem>£{(finances.perDayPence / 100).toFixed(2)} / day</TabletItem>
      </Tablet>
    ) :
      (
        <Tablet $isMobile={mobile}>
          <TabletItem>
            Loading
          </TabletItem>
          <Splitter />
          <TabletItem>Finance Data</TabletItem>
        </Tablet>
      )
  }

  const onUpdateDedicatedSpending = () => {
    publish(EVENT_TYPES.DEDICATED_SPENDING_OPEN, null);
    setVisible(false);
  }

  return (
    <>
      <MobileGroup $direction='row'>
        <MobileOnlyIcon icon='menu' onClick={() => setVisible(!visible)} />
        {financesElement(true)}
        <MobileOnlyIcon icon='logout' onClick={HandleSignOutClick} />
      </MobileGroup>
      <StyledHeader $visible={visible}>
        <Group $direction='row'>
          <Logo src="/logo.png" alt={`${GetAppName()} v${GetAppVersion()}`} title={`${GetAppName()} v${GetAppVersion()}`} />
          <MobileOnlyIcon icon='close' onClick={() => setVisible(!visible)} />
        </Group>
        <Group>
          <Link onClick={() => publish(EVENT_TYPES.SALARY_DETAILS_OPEN, null)}>Update Salary Details</Link>
          {financesElement()}
          <Link onClick={() => onUpdateDedicatedSpending()}>Update Dedicated Spending</Link>
        </Group>
        <Group>
          <DesktopOnlyIcon icon="logout" onClick={HandleSignOutClick} />
        </Group>
      </StyledHeader>
    </>
  );
};
