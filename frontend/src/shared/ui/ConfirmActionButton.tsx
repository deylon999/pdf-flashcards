import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { getErrorMessage } from '@/shared/api';

type Props = {
  label: string;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

export function ConfirmActionButton({ label, title, description, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      setOpen(false);
    } catch (failure) {
      setError(getErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="small" color="error" onClick={() => { setError(''); setOpen(true); }}>{label}</Button>
      <Dialog open={open} onClose={() => { if (!busy) setOpen(false); }} maxWidth="xs" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{description}</Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" color="error" disabled={busy} onClick={confirm}>
            {busy ? 'Удаляем…' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
