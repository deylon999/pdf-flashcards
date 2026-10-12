import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import type { Card as CardData } from '@/entities/card';
import { EmptyState, FlipCard } from '@/shared/ui';

type Props = {
  cards: CardData[];
};

export function Trainer({ cards }: Props) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (cards.length === 0) {
    return <EmptyState sx={{ mb: 3 }}>В колоде пока нет карточек</EmptyState>;
  }

  if (index >= cards.length) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography>Колода пройдена</Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              setIndex(0);
              setShowAnswer(false);
            }}
          >
            Начать заново
          </Button>
        </CardActions>
      </Card>
    );
  }

  const card = cards[index];

  function next() {
    setIndex(index + 1);
    setShowAnswer(false);
  }

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Карточка {index + 1} из {cards.length}
        </Typography>
        {/* key сбрасывает переворот при переходе к следующей карточке, чтобы не мелькал её ответ */}
        <FlipCard
          key={card.id}
          flipped={showAnswer}
          front={<Typography variant="h5" sx={{ minHeight: { xs: 48, sm: 64 } }}>{card.question}</Typography>}
          back={<Typography variant="h5" sx={{ minHeight: { xs: 48, sm: 64 } }}>{card.answer}</Typography>}
        />
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {showAnswer ? (
            <Button variant="contained" onClick={next}>
              Дальше
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setShowAnswer(true)}>
              Показать ответ
            </Button>
          )}
          <Button onClick={next}>Пропустить</Button>
        </Box>
      </CardActions>
    </Card>
  );
}
