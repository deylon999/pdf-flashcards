import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DeckPage } from './pages/DeckPage';
import { StatsPage } from './pages/StatsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="decks/:id" element={<DeckPage />} />
        <Route path="stats" element={<StatsPage />} />
      </Route>
    </Routes>
  );
}
