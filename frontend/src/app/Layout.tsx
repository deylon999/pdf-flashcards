import { NavLink, Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

export function Layout() {
  return (
    <Box>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Карточки
          </Typography>
          <Button component={NavLink} to="/" end color="inherit" sx={{ '&.active': { color: 'primary.main' } }}>
            Главная
          </Button>
          <Button component={NavLink} to="/stats" color="inherit" sx={{ '&.active': { color: 'primary.main' } }}>
            Статистика
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
