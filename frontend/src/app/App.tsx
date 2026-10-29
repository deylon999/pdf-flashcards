import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@/pages/home';
import { DeckPage } from '@/pages/deck';
import { StatsPage } from '@/pages/stats';
import { NotFoundPage } from '@/pages/not-found';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { RequireAuth } from '@/features/auth';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route index element={<HomePage />} />
          <Route path="decks/:id" element={<DeckPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
