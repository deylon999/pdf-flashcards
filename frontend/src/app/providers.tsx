import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { DecksProvider } from '@/entities/deck';
import { AuthProvider, useAuth } from '@/entities/user';
import { theme } from './theme';

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <UserDecks>{children}</UserDecks>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function UserDecks({ children }: Props) {
  const { user } = useAuth();
  return <DecksProvider key={user?.id ?? 'guest'} active={Boolean(user)}>{children}</DecksProvider>;
}
