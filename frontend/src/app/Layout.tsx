import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Alert, AppBar, Box, Button, Container, Fade, Toolbar, Typography } from '@mui/material';
import { useAuth } from '@/entities/user';

export function Layout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  async function logout() {
    setLoggingOut(true);
    setLogoutError('');
    try {
      await signOut();
    } catch {
      setLogoutError('Не удалось завершить сессию на сервере. Попробуйте выйти ещё раз');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <Box>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Карточки
          </Typography>
          <Button component={NavLink} to="/" end color="inherit" sx={{ '&.active': { color: 'primary.main' } }}>
            Главная
          </Button>
          <Button component={NavLink} to="/stats" color="inherit" sx={{ '&.active': { color: 'primary.main' } }}>
            Статистика
          </Button>
          {user ? (
            <>
              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>{user.username}</Typography>
              <Button color="inherit" onClick={logout} disabled={loggingOut}>
                {loggingOut ? 'Выходим…' : 'Выйти'}
              </Button>
            </>
          ) : (
            <Button component={NavLink} to="/login" color="inherit">Войти</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        {logoutError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLogoutError('')}>{logoutError}</Alert>}
        {/* key по адресу: при смене страницы содержимое плавно появляется заново */}
        <Fade key={location.pathname} in appear timeout={300}>
          <Box>
            <Outlet />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
