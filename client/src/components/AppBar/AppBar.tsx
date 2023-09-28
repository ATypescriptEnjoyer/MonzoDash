import React from 'react';
import { GetAppName, GetAppVersion } from '../../utils';
import { Icon } from '../';
import { Group, Link, Logo, StyledHeader } from './AppBar.styled';
import { ApiConnector } from '../../network';

export const AppBar = (): JSX.Element => {
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
      <Logo
        src="/icon-192x192.png"
        alt={`${GetAppName()} v${GetAppVersion()}`}
        title={`${GetAppName()} v${GetAppVersion()}`}
      />
      <Group>
        <Link>Update Salary Details</Link>
        <Link>Update Dedicated Spending</Link>
      </Group>
      <Group>
        <Icon icon="logout" onClick={HandleSignOutClick} />
      </Group>
    </StyledHeader>
  );
};
