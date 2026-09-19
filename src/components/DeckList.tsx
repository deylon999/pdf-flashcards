import { Link } from 'react-router-dom';
import type { Deck } from '../types';

type Props = {
  decks: Deck[];
};

export function DeckList({ decks }: Props) {
  return (
    <div>
      {decks.map(deck => (
        <div key={deck.id}>
          <h2>
            <Link to={`/decks/${deck.id}`}>{deck.title}</Link>
          </h2>
          <p>{deck.description}</p>
          <p>Карточек: {deck.cards.length}</p>
        </div>
      ))}
    </div>
  );
}
