import { useState, type ReactNode } from 'react';
import { Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import type { Card as CardData } from '../model/types';

type Props = {
  card: CardData;
  actions?: ReactNode;
};

export function CardView({ card, actions }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {flipped ? 'Ответ' : 'Вопрос'}
        </Typography>
        <Typography variant="h6">{flipped ? card.answer : card.question}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }} onClick={e => e.stopPropagation()}>
        {actions}
        <Chip
          size="small"
          label={card.learned ? 'Выучено' : 'Не выучено'}
          color={card.learned ? 'primary' : 'default'}
          variant={card.learned ? 'filled' : 'outlined'}
        />
      </CardActions>
    </Card>
  );
}
