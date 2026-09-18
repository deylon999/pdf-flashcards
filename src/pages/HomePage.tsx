import { DeckList } from '../components/DeckList';
import { decks } from '../mocks/decks';

export function HomePage() {
  return (
    <div>
      <h1>Карточки</h1>
      <DeckList decks={decks} />
    </div>
  );
}
