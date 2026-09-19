import { useParams } from 'react-router-dom';
import { decks } from '../mocks/decks';
import { CardItem } from '../components/CardItem';

export function DeckPage() {
  const { id } = useParams();
  const deck = decks.find(deck => deck.id === id);

  if (!deck) {
    return <p>Такой колоды нет</p>;
  }

  return (
    <div>
      <h2>{deck.title}</h2>
      <p>{deck.description}</p>
      {deck.cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
