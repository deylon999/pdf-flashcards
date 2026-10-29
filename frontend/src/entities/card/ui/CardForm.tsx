import { useState, type SyntheticEvent } from 'react';
import { Alert, Box, Button, TextField } from '@mui/material';
import { getErrorMessage } from '@/shared/api';
import { MAX_LENGTH, validateCard, type CardFormValues } from '../model/validate';

type Props = {
  existingQuestions: string[];
  onSave: (question: string, answer: string) => Promise<void>;
  initialValues?: CardFormValues;
  submitLabel?: string;
  resetAfterSave?: boolean;
};

const emptyValues: CardFormValues = { question: '', answer: '' };

export function CardForm({ existingQuestions, onSave, initialValues = emptyValues,
  submitLabel = 'Добавить', resetAfterSave = false }: Props) {
  const [values, setValues] = useState<CardFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof CardFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const errors = validateCard(values, existingQuestions);
  const hasErrors = Object.keys(errors).length > 0;

  function visibleError(field: keyof CardFormValues) {
    return submitted || touched[field] ? errors[field] : undefined;
  }

  function change(field: keyof CardFormValues, value: string) {
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
      await onSave(values.question.trim(), values.answer.trim());
      if (resetAfterSave) setValues(emptyValues);
      setTouched({});
      setSubmitted(false);
    } catch (failure) {
      setError(getErrorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  const questionError = visibleError('question');
  const answerError = visibleError('answer');

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
        label="Вопрос"
        size="small"
        value={values.question}
        disabled={busy}
        onChange={e => change('question', e.target.value)}
        onBlur={() => setTouched({ ...touched, question: true })}
        error={Boolean(questionError)}
        helperText={questionError ?? `${values.question.trim().length}/${MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField
        label="Ответ"
        size="small"
        value={values.answer}
        disabled={busy}
        onChange={e => change('answer', e.target.value)}
        onBlur={() => setTouched({ ...touched, answer: true })}
        error={Boolean(answerError)}
        helperText={answerError ?? `${values.answer.trim().length}/${MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained" disabled={busy || (submitted && hasErrors)}>
        {busy ? 'Сохраняем…' : submitLabel}
      </Button>
    </Box>
    </>
  );
}
