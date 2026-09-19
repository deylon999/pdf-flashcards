import { useState } from 'react';
import { Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import type { Card as CardData } from '../types';

type Props = {
  card: CardData;
};

export function CardItem({ card }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [isLearned, setIsLearned] = useState(card.learned);

  return (
    <Card variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {flipped ? 'Ответ' : 'Вопрос'}
        </Typography>
        <Typography variant="h6">{flipped ? card.answer : card.question}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          color={isLearned ? 'error' : 'primary'}
          onClick={e => {
            e.stopPropagation();
            setIsLearned(!isLearned);
          }}
        >
          {isLearned ? 'Убрать из выученных' : 'Выучено'}
        </Button>
        <Chip
          size="small"
          label={isLearned ? 'Выучено' : 'Не выучено'}
          color={isLearned ? 'primary' : 'default'}
          variant={isLearned ? 'filled' : 'outlined'}
        />
      </CardActions>
    </Card>
  );
}
