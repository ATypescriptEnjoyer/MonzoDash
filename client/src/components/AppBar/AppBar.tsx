import React from 'react';
import { AppBar as MaterialAppBar, Toolbar } from '@mui/material';
import { GetAppName, GetAppVersion } from '../../utils';
import { UnselectableTypography } from '../';
import { SignOut, AppBarIcon } from './AppBar.styled';
import { ApiConnector } from '../../network';
import logo from '/monzodash.png';

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
    <MaterialAppBar position="relative">
      <Toolbar>
        <AppBarIcon src={logo} />
        <UnselectableTypography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          {GetAppName()} v{GetAppVersion()}
        </UnselectableTypography>
        <SignOut onClick={HandleSignOutClick} variant="h6" color="inherit" noWrap>
          Sign Out
        </SignOut>
      </Toolbar>
    </MaterialAppBar>
  );
};
