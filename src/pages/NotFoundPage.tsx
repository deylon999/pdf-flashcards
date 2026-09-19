import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

export function NotFoundPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Страница не найдена
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Проверь адрес, такой страницы у нас нет
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        На главную
      </Button>
    </>
  );
}
