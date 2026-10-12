import { useState, type SyntheticEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateDeck,
  type DeckFormValues,
} from '../model/validate';

type Props = {
  existingTitles: string[];
  onCreate: (title: string, description: string) => void;
};

const emptyValues: DeckFormValues = { title: '', description: '' };

export function CreateDeckForm({ existingTitles, onCreate }: Props) {
  const [values, setValues] = useState<DeckFormValues>(emptyValues);
  const [touched, setTouched] = useState<Partial<Record<keyof DeckFormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateDeck(values, existingTitles);
  const hasErrors = Object.keys(errors).length > 0;

  function visibleError(field: keyof DeckFormValues) {
    return submitted || touched[field] ? errors[field] : undefined;
  }

  function change(field: keyof DeckFormValues, value: string) {
    setValues({ ...values, [field]: value });
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) {
      return;
    }
    onCreate(values.title.trim(), values.description.trim());
    setValues(emptyValues);
    setTouched({});
    setSubmitted(false);
  }

  const titleError = visibleError('title');
  const descriptionError = visibleError('description');

  return (
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
        onChange={e => change('description', e.target.value)}
        onBlur={() => setTouched({ ...touched, description: true })}
        error={Boolean(descriptionError)}
        helperText={descriptionError ?? `${values.description.trim().length}/${DESCRIPTION_MAX_LENGTH}`}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained" disabled={submitted && hasErrors}>
        Создать
      </Button>
    </Box>
  );
}
