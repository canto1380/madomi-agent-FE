import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
