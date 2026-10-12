import { useState, type SyntheticEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { MAX_LENGTH, validateCard, type CardFormValues } from '../model/validate';

type Props = {
  existingQuestions: string[];
  onAdd: (question: string, answer: string) => void;
};

const emptyValues: CardFormValues = { question: '', answer: '' };

export function CardForm({ existingQuestions, onAdd }: Props) {
  const [values, setValues] = useState<CardFormValues>(emptyValues);
  const [touched, setTouched] = useState<Partial<Record<keyof CardFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateCard(values, existingQuestions);
  const hasErrors = Object.keys(errors).length > 0;

  function visibleError(field: keyof CardFormValues) {
    return submitted || touched[field] ? errors[field] : undefined;
  }

  function change(field: keyof CardFormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      return;
    }
    onAdd(values.question.trim(), values.answer.trim());
    setValues(emptyValues);
    setTouched({});
    setSubmitted(false);
  }

  const questionError = visibleError('question');
  const answerError = visibleError('answer');

  return (
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
        onChange={e => change('answer', e.target.value)}
        onBlur={() => setTouched({ ...touched, answer: true })}
        error={Boolean(answerError)}
        helperText={answerError ?? `${values.answer.trim().length}/${MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained" disabled={submitted && hasErrors}>
        Добавить
      </Button>
    </Box>
  );
}
