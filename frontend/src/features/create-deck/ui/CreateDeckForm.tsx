import { useState, type SyntheticEvent } from 'react';
import { Box, Button, TextField } from '@mui/material';

type Props = {
  onCreate: (title: string, description: string) => void;
};

export function CreateDeckForm({ onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    onCreate(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
      <TextField
        label="Название колоды"
        size="small"
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField
        label="Описание"
        size="small"
        value={description}
        onChange={e => setDescription(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button type="submit" variant="contained">
        Создать
      </Button>
    </Box>
  );
}
