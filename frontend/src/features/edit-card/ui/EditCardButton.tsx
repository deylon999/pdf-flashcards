import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CardForm, type Card } from '@/entities/card';

type Props = {
  card: Card;
  existingQuestions: string[];
  onSave: (question: string, answer: string) => Promise<void>;
};

export function EditCardButton({ card, existingQuestions, onSave }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>Редактировать карточку</Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Редактирование карточки</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <CardForm initialValues={card} existingQuestions={existingQuestions}
            submitLabel="Сохранить" onSave={async (question, answer) => {
              await onSave(question, answer);
              setOpen(false);
            }} />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Закрыть</Button></DialogActions>
      </Dialog>
    </>
  );
}
