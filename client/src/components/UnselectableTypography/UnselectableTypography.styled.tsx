import styled from 'styled-components';
import { Typography } from '@mui/material';

export const UnselectableTypography = styled(Typography)`
  user-select: none;
  && {
    color: white;
  }
`;
