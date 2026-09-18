import type { Card } from './types';
import { CardItem } from './components/CardItem';

export function App() {
  const card: Card = {
        id: '1',
        question: 'Что такое DOM?',
        answer: 'Дерево элементов',
        learned: false,
      };
      
  const card2: Card = {
    id: '2',
    question: 'Что такое пропс?',
    answer: 'Данные, которые передают компоненту снаружи',
    learned: false,
  };

  return (
    <div>
      <CardItem card={card} /> 
      <CardItem card={card2} />
    </div>
  );
}