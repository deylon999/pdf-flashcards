import { useState, type SyntheticEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useAuth } from '@/entities/user';
import { ApiError, apiRequest } from '@/shared/api';
import { ErrorMessage, Loader } from '@/shared/ui';

export function AuthForm({ register = false }: { register?: boolean }) {
  const { user, status, restoreSession, signIn } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const name = username.trim();
  const usernameError = /^[a-zA-Z0-9_]{3,50}$/.test(name)
    ? '' : 'От 3 до 50 символов: латинские буквы, цифры и _';
  const passwordError = password.length >= 8 && password.length <= 128
    ? '' : 'Пароль должен содержать от 8 до 128 символов';

  if (status === 'loading') return <Loader text="Проверяем сессию…" />;
  if (status === 'error') return <ErrorMessage text="Не удалось связаться с сервером" onRetry={restoreSession} />;
  if (user) return <Navigate to={location.state?.from || '/'} replace />;

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError('');
    if (usernameError || passwordError || busy) return;
    setBusy(true);
    try {
      if (register && !registered) {
        await apiRequest('/auth/register', {
          method: 'POST', body: JSON.stringify({ username: name, password }),
        }, false);
        // Если вход не удался из-за сети, повторная отправка не регистрирует аккаунт снова.
        setRegistered(true);
      }
      await signIn(name, password);
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : 'Сервер недоступен. Попробуйте ещё раз');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 440, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          {register ? 'Регистрация' : 'Вход'}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {registered && <Alert severity="success">Аккаунт создан. Теперь можно войти.</Alert>}
          <TextField label="Логин" autoComplete="username" value={username}
            disabled={busy || registered}
            onChange={event => setUsername(event.target.value)}
            error={submitted && Boolean(usernameError)}
            helperText={submitted && usernameError ? usernameError : 'Латинские буквы, цифры и _'} />
          <TextField label="Пароль" type="password"
            autoComplete={register && !registered ? 'new-password' : 'current-password'}
            value={password} disabled={busy}
            onChange={event => setPassword(event.target.value)}
            error={submitted && Boolean(passwordError)}
            helperText={submitted && passwordError ? passwordError : 'От 8 до 128 символов'} />
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? 'Подождите…' : register && !registered ? 'Создать аккаунт' : 'Войти'}
          </Button>
          <Button component={Link} to={register ? '/login' : '/register'} state={location.state} disabled={busy}>
            {register ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
