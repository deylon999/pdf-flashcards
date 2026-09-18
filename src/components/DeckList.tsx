import type { Deck } from '../types';
import { CardItem } from './CardItem';

type Props = {
  decks: Deck[];
};

export function DeckList({ decks }: Props) {
  return (
    <div>
      {decks.map(deck => (
        <div key={deck.id}>
          <h2>{deck.title}</h2>
          <p>{deck.description}</p>
          <p>Карточек: {deck.cards.length}</p>
          {deck.cards.map(card => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      ))}
    </div>
  );
}
