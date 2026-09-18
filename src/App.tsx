import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StatsPage } from './pages/StatsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  );
}
