import { Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { useDecks, type Deck } from '@/entities/deck';
import { percent } from '@/shared/lib';
import { EmptyState, ErrorMessage, Loader } from '@/shared/ui';

export function StatsPage() {
  const { decks, status, error, reload } = useDecks();
  const total = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const learned = decks.reduce((sum, deck) => sum + deck.cards.filter(card => card.learned).length, 0);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Статистика
      </Typography>
      {status === 'loading' && <Loader text="Считаем статистику…" />}
      {status === 'error' && <ErrorMessage text={error} onRetry={reload} />}
      {status === 'ready' && total === 0 && <EmptyState>Пока нечего считать — нет ни одной карточки</EmptyState>}
      {status === 'ready' && total > 0 && <StatsContent decks={decks} learned={learned} total={total} />}
    </>
  );
}

type StatsContentProps = {
  decks: Deck[];
  learned: number;
  total: number;
};

function StatsContent({ decks, learned, total }: StatsContentProps) {
  return (
    <>
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
