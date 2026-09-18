import { useState } from 'react';
import type { Card } from '../types';

type Props = {
  card: Card;
};

export function CardItem({ card }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [isLearned, setIsLearned] = useState(card.learned)

  return (
    <div onClick={() => setFlipped(!flipped)}>
      <h3>{flipped ? card.answer : card.question}</h3>
      <p>{flipped ? 'Ответ' : 'Вопрос'}</p>

      <button onClick={(e) => { e.stopPropagation(); setIsLearned(!isLearned)}}>Выучено</button>
      <p>{isLearned ? 'Выучено' : 'Не выучено'}</p>
    </div>
  );
}
