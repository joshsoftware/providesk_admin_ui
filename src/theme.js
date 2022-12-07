import { createTheme } from '@mui/material';

export const palette = {
  primary: {
    main: '#0091ea',
    light: '#DEEBF1',
    assigned: '#0091ea',
    inprogress: '#4527a0',
    resolved: '#43a047',
    for_approval: '#e65100',
    closed: '#424242',
    rejected: '#c62828'
  },
  background: {
    default: '#F8F9FA'
  }
};

export const theme = createTheme({
  palette,
  spacing: [0, 4, 8, 16, 24, 32, 40, 48],
  typography: {
    htmlFontSize: 16,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2.5rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.75rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.5rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1.25rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '1rem',
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: 0,
    },
    subtitle1: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '0.875rem',
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: 0,
    },
    subtitle2: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '0.75rem',
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: 0,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    }
  },
});
