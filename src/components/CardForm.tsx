import { useState, type SyntheticEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';

type Props = {
  onAdd: (question: string, answer: string) => void;
};

export function CardForm({ onAdd }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      return;
    }
    onAdd(question, answer);
    setQuestion('');
    setAnswer('');
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        label="Вопрос"
        size="small"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField
        label="Ответ"
        size="small"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained">
        Добавить
      </Button>
    </Box>
  );
}
