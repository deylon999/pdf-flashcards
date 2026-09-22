import { Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { decks } from '../mocks/decks';

function percent(learned: number, total: number) {
  if (total === 0) {
    return 0;
  }
  return Math.round((learned / total) * 100);
}

export function StatsPage() {
  const total = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const learned = decks.reduce((sum, deck) => sum + deck.cards.filter(card => card.learned).length, 0);

  if (total === 0) {
    return (
      <>
        <Typography variant="h4" gutterBottom> 
          Статистика
        </Typography>
        <Typography color="text.secondary">Пока нечего считать — нет ни одной карточки</Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Статистика
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Выучено {learned} из {total} карточек
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percent(learned, total)}
        sx={{ height: 8, borderRadius: 4, mb: 4 }}
      />

      {decks.map(deck => {
        const deckLearned = deck.cards.filter(card => card.learned).length;

        return (
          <Card key={deck.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {deck.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {deckLearned} из {deck.cards.length} — {percent(deckLearned, deck.cards.length)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={percent(deckLearned, deck.cards.length)}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
