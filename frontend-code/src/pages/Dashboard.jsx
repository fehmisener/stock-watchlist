import * as React from 'react';

import { Box, Divider, ThemeProvider, createTheme } from '@mui/material';

import getLPTheme from '../getLPTheme';
import Watchlist from '../components/Watchlist';
import Header from '../components/Layouts/Header';
import Footer from '../components/Layouts/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from '../components/Layouts/AppAppBar';

export default function Dashboard() {
  const [mode, setMode] = React.useState('dark');
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Header />
      <Divider />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Watchlist />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
