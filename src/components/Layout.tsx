import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <header>
        <h1>Карточки</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
