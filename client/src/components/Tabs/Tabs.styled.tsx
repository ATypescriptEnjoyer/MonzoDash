import styled from 'styled-components';
import { Box } from '@mui/material';

export const DarkBox = styled(Box)`
  div[role='tabpanel'] {
    .MuiBox-root {
      padding: 0;
    }

    .MuiTypography-root > div {
      margin-top: 40px;
    }
  }

  .css-1r7avug-MuiButtonBase-root-MuiTab-root {
    color: gray;

    &.Mui-selected {
      color: #121212;
    }
  }

  .css-3sx0hq-MuiTabs-indicator {
    background-color: #121212;
  }
`;
