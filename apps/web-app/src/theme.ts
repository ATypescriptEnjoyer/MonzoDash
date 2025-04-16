import { createTheme, lighten } from '@mui/material';

export const colours = {
  black: '#0e1217',
  grey: '#2b333e',
  lightGrey: '#838d9e',
  blackLighten: '#0c0e12',
  white: '#F5F5F5',
  pink: '#fe648f',
  blue: '#4ee0fe',
};

const defaultTheme = createTheme();

export const theme = createTheme({
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          backgroundColor: lighten(colours.blackLighten, 0.05),
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        startIcon: {
          margin: 0,
        },
        root: {
          borderColor: colours.pink,
          color: colours.white,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        caption: {
          color: colours.blue,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          padding: defaultTheme.spacing(2),
          borderRadius: defaultTheme.shape.borderRadius,
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: colours.blue,
    },
    secondary: {
      main: colours.pink,
    },
    background: {
      default: colours.black,
      paper: colours.blackLighten,
    },
    common: {
      black: colours.black,
      white: colours.white,
    },
  },
});
