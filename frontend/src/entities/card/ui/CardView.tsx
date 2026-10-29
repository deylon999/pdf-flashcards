import { useState, type ReactNode } from 'react';
import { Card, CardActions, CardContent, Chip, Typography } from '@mui/material';
import { FlipCard } from '@/shared/ui';
import type { Card as CardData } from '../model/types';

type Props = {
  card: CardData;
  actions?: ReactNode;
};

function Side({ label, text }: { label: string; text: string }) {
  return (
    <>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6">{text}</Typography>
    </>
  );
}

export function CardView({ card, actions }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Card data-testid={`card-${card.id}`} variant="outlined" sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setFlipped(!flipped)}>
      <CardContent>
        <FlipCard
          flipped={flipped}
          front={<Side label="Вопрос" text={card.question} />}
          back={<Side label="Ответ" text={card.answer} />}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }} onClick={e => e.stopPropagation()}>
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
