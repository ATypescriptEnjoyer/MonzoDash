import React from 'react';
import { AppBar as MaterialAppBar, Toolbar } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import { GetAppName, GetAppVersion } from '../../utils';
import { UnselectableTypography } from '../';
import { SignOut } from './AppBar.styled';
import { ApiConnector } from '../../network';

export const AppBar = (): JSX.Element => {
  const HandleSignOutClick = async (): Promise<void> => {
    try {
      await ApiConnector.post('/auth/signout');
    } catch (error) {
      console.error(error);
    }
    window.location.href = '/setup';
  };

  return (
    <MaterialAppBar position="relative">
      <Toolbar>
        <SmartToy sx={{ mr: 2 }} />
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
