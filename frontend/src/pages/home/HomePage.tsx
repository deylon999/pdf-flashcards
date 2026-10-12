import { Typography } from '@mui/material';
import { DeckList, decks } from '../../entities/deck';

export function HomePage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Мои колоды
      </Typography>
      <DeckList decks={decks} />
    </>
  );
}
