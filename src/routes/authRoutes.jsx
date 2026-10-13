import { Route } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { SignupPage } from '../pages/auth/SignupPage.jsx';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
  </>
);

export default authRoutes;
