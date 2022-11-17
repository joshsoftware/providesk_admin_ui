import { createTheme } from '@mui/material';

export const palette = {
  primary: {
    main: '#4c02c5',
    light: '#7e4ff4',
    tint: '#ae90fc',
    contrastText: '#ffffff',
    scriptbox: '#faf4f8',
  },
  secondary: {
    main: '#4c02c5',
    light: '#7e4ff4',
    tint: '#ae90fc',
    contrastText: '#ffffff',
  },
  neutral: {
    highEm: '#8A2424',
    mediumEm: '#B75656',
    disabled: '#948fae',
    borders: '#d7d5f4',
    background: '#faf8ff',
    white: '#FFFFFF',
    black: '#332222',
    link: '#D27575',
    tab: '#007bff',
  },
};
export const theme = createTheme({
  palette,
  typography: {
    fontFamily: ['Nunito Sans', 'Open Sans', 'sans-serif'].join(','),
    fontSize: 12,
    breadcrumbs: {
      fontSize: '12px',
      fontWeight: 400,
      textDecoration: 'none',
      fontFamily: 'Open Sans',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '32px',
    },
    subheading: {
      fontSize: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
    h3: {
      fontFamily: 'Nunito Sans',
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '24px',
    },
    h4: {
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: 700,
      padding: '20px 0',
    },
    h5: {
      fontSize: '14px',
      fontWeight: 700,
    },
    h6: {
      fontSize: '12px',
      fontWeight: 700,
    },
  },
});
