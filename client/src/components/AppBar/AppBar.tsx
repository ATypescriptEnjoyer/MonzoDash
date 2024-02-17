import React, { useEffect, useState } from 'react';
import { GetAppName, GetAppVersion } from '../../utils';
import { Icon } from '../';
import { Group, Link, Logo, Splitter, StyledHeader, Tablet, TabletItem } from './AppBar.styled';
import { ApiConnector } from '../../network';
import { publish, EVENT_TYPES } from '../../event';
import { CurrentFinances } from '../../../../shared/interfaces/finances';
import axios from 'axios';

export const AppBar = (): JSX.Element => {
  const [finances, setFinances] = useState<CurrentFinances>();

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

  return (
    <StyledHeader>
      <Logo src="/logo.png" alt={`${GetAppName()} v${GetAppVersion()}`} title={`${GetAppName()} v${GetAppVersion()}`} />
      <Group>
        <Link onClick={() => publish(EVENT_TYPES.SALARY_DETAILS_OPEN, null)}>Update Salary Details</Link>
        {finances && (
          <Tablet>
            <TabletItem>
              £{(finances?.balancePence / 100).toFixed(2)} / {finances.daysTilPay} days
            </TabletItem>
            <Splitter />
            <TabletItem>£{(finances.perDayPence / 100).toFixed(2)} / day</TabletItem>
          </Tablet>
        )}
        <Link onClick={() => publish(EVENT_TYPES.DEDICATED_SPENDING_OPEN, null)}>Update Dedicated Spending</Link>
      </Group>
      <Group>
        <Icon icon="logout" onClick={HandleSignOutClick} />
      </Group>
    </StyledHeader>
  );
};
