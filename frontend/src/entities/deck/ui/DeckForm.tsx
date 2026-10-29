import { useState, type SyntheticEvent } from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { getErrorMessage } from '@/shared/api';
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateDeck,
  type DeckFormValues,
} from '../model/validate';

type Props = {
  existingTitles: string[];
  onSave: (title: string, description: string) => Promise<void>;
  initialValues?: DeckFormValues;
  submitLabel?: string;
  resetAfterSave?: boolean;
};

const emptyValues: DeckFormValues = { title: '', description: '' };

export function DeckForm({ existingTitles, onSave, initialValues = emptyValues,
  submitLabel = 'Создать', resetAfterSave = false }: Props) {
  const [values, setValues] = useState<DeckFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof DeckFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const errors = validateDeck(values, existingTitles);
  const hasErrors = Object.keys(errors).length > 0;

  function visibleError(field: keyof DeckFormValues) {
    return submitted || touched[field] ? errors[field] : undefined;
  }

  function change(field: keyof DeckFormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors || busy) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSave(values.title.trim(), values.description.trim());
      if (resetAfterSave) setValues(emptyValues);
      setTouched({});
      setSubmitted(false);
    } catch (failure) {
      setError(getErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  const titleError = visibleError('title');
  const descriptionError = visibleError('description');

  return (
    <>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2, mb: 3 }}
    >
      <TextField
        label="Название колоды"
        size="small"
        value={values.title}
        disabled={busy}
        onChange={e => change('title', e.target.value)}
        onBlur={() => setTouched({ ...touched, title: true })}
        error={Boolean(titleError)}
        helperText={titleError ?? `${values.title.trim().length}/${TITLE_MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField
        label="Описание"
        size="small"
        value={values.description}
        disabled={busy}
        onChange={e => change('description', e.target.value)}
        onBlur={() => setTouched({ ...touched, description: true })}
        error={Boolean(descriptionError)}
        helperText={descriptionError ?? `${values.description.trim().length}/${DESCRIPTION_MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained" disabled={busy || (submitted && hasErrors)}>
        {busy ? 'Сохраняем…' : submitLabel}
      </Button>
    </Box>
    </>
  );
}
