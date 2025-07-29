import { createTheme } from '@mui/material';

export const customPalette = {
  base: {
    dark: '#000000',
    light: '#ffffff',
  },
  primary: {
    a0: '#ff6390',
    a10: '#ff779c',
    a20: '#ff8aa7',
    a30: '#ff9cb3',
    a40: '#ffadc0',
    a50: '#ffbecc',
  },
  surface: {
    a0: '#121212',
    a10: '#282828',
    a20: '#3f3f3f',
    a30: '#575757',
    a40: '#717171',
    a50: '#8b8b8b',
  },
  surfaceTonal: {
    a0: '#271b1d',
    a10: '#3c3032',
    a20: '#514648',
    a30: '#685e5f',
    a40: '#7f7778',
    a50: '#989091',
  },
};

export const themeColors = {
  primary: {
    main: customPalette.primary.a0,
    light: customPalette.primary.a30,
    dark: customPalette.primary.a50,
  },
  background: {
    default: customPalette.surface.a0,
    paper: customPalette.surface.a10,
  },
  text: {
    primary: customPalette.base.light,
    secondary: customPalette.surface.a50,
  },
  surfaceTonal: customPalette.surfaceTonal,
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
          backgroundColor: customPalette.surface.a10,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        startIcon: {
          margin: 0,
        },
        root: {
          borderColor: customPalette.primary.a0,
          color: customPalette.base.light,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        caption: {
          color: customPalette.primary.a0,
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
      main: customPalette.primary.a0,
    },
    background: {
      default: customPalette.surface.a0,
      paper: customPalette.surface.a10,
    },
    common: {
      black: customPalette.base.dark,
      white: customPalette.base.light,
    }
  },
  chat: {
    user: "#4ee0fe",
    assistant: customPalette.primary.a0,
  },
});

declare module '@mui/material/styles' {
  interface Theme {
    chat: {
      user: string;
      assistant: string;
    };
  }
  interface ThemeOptions {
    chat?: {
      user?: string;
      assistant?: string;
    };
  }
}

