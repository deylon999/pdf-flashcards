import type { Card } from '../types';

type Props = {
  card: Card;
};

export function CardItem({ card }: Props) {
  return (
    <div>
      <h3>{card.question}</h3>
      <p>{card.answer}</p>
    </div>
  );
}
