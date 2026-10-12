import { Typography } from '@mui/material';
import { DeckList, useDecks } from '@/entities/deck';
import { CreateDeckForm } from '@/features/create-deck';

export function HomePage() {
  const { decks, addDeck } = useDecks();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Мои колоды
      </Typography>
      <CreateDeckForm onCreate={addDeck} />
      <DeckList decks={decks} />
    </>
  );
}
