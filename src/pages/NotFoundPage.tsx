import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div>
      <h2>Страница не найдена</h2>
      <p>Проверь адрес или вернись на <Link to="/">главную</Link></p>
    </div>
  );
}
