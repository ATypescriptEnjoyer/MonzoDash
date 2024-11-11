import { createTheme } from '@mui/material';

export const colours = {
  black: '#0e1217',
  grey: '#2b333e',
  lightGrey: '#838d9e',
  white: '#F5F5F5',
  pink: '#fe648f',
  blue: '#4ee0fe',
};

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: colours.pink,
          color: colours.white
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#0e1217',
    },
  },
});
