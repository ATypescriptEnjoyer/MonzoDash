import React from 'react';
import { AppBar as MaterialAppBar, Toolbar } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import { GetAppName, GetAppVersion } from '../../utils';
import { UnselectableTypography } from '../';

export const AppBar = (): JSX.Element => (
  <MaterialAppBar>
    <Toolbar>
      <SmartToy sx={{ mr: 2 }} />
      <UnselectableTypography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        {GetAppName()}
      </UnselectableTypography>
      <UnselectableTypography variant="h6" color="inherit" noWrap>
        Version {GetAppVersion()}
      </UnselectableTypography>
    </Toolbar>
  </MaterialAppBar>
);
