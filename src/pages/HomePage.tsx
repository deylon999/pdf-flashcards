import { Typography } from '@mui/material';
import { DeckList } from '../components/DeckList';
import { decks } from '../mocks/decks';

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
