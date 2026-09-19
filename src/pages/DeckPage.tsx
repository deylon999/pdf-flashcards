import { useNavigate, useParams } from 'react-router-dom';
import { decks } from '../mocks/decks';
import { CardItem } from '../components/CardItem';

export function DeckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deck = decks.find(deck => deck.id === id);

  if (!deck) {
    return <p>Такой колоды нет</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Назад</button>
      <h2>{deck.title}</h2>
      <p>{deck.description}</p>
      {deck.cards.map(card => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
