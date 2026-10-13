import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage.jsx';
import { authRoutes } from './authRoutes.jsx';
import { adminRoutes } from './admin/adminRoutes.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {authRoutes}
      {adminRoutes}
    </Routes>
  );
}
