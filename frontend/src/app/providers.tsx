import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { DecksProvider } from '@/entities/deck';
import { theme } from './theme';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DecksProvider>{children}</DecksProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
