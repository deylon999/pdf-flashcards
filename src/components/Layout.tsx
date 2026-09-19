import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <header>
        <h1>Карточки</h1>
        <nav>
          <NavLink to="/" style={({ isActive }) => ({ marginRight: 10, fontWeight: isActive ? 'bold' : 'normal' })}>
            Главная
          </NavLink>
          <NavLink to="/stats" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Статистика
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
