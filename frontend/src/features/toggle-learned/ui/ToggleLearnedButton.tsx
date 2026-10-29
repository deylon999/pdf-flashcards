import { useState } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { getErrorMessage } from '@/shared/api';

type Props = {
  learned: boolean;
  onToggle: () => Promise<void>;
};

export function ToggleLearnedButton({ learned, onToggle }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function toggle() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onToggle();
    } catch (failure) {
      setError(getErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box>
      <Button size="small" color={learned ? 'error' : 'primary'} onClick={toggle} disabled={busy}>
        {busy ? 'Сохраняем…' : learned ? 'Убрать из выученных' : 'Выучено'}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
