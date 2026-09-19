import { DeckList } from '../components/DeckList';
import { decks } from '../mocks/decks';

export function HomePage() {
  return <DeckList decks={decks} />;
}
