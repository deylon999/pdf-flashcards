import { Typography } from '@mui/material';
import { DeckList, useDecks } from '@/entities/deck';

export function HomePage() {
  const { decks } = useDecks();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Мои колоды
      </Typography>
      <DeckList decks={decks} />
    </>
  );
}
