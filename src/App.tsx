import type { Card } from './types';

export function App() {
  const name = 'Ваше имя';
  const age = 25;
  const movies = ['Матрица', 'Интерстеллар', 'Бойцовский клуб', 'Начало'];

  const card: Card = {
        id: '1',
        question: 'Что такое DOM?',
        answer: 'Дерево элементов',
        learned: false,
      };  

  return (
    <div>
      <h1>Карточки</h1>
      <p>Меня зовут: {name}</p>
      <p>Через 10 лет мне будет: {age+10}</p>
      <ul>
        {movies.map(movie => <li key={movie}>{movie}</li>)}
      </ul>
      <p>{age >= 18 ? 'Совершеннолетний' : 'Несовершеннолетний'}</p>
    </div>
  );
}