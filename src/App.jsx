import { AppProviders } from './providers/QueryProvider.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import './styles/index.css';
import './styles/admin-usuarios.css';
import './styles/admin-shell.css';
import './styles/admin-comercial.css';
import './styles/auth.css';

export function App() {
  return (
    <AppProviders>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppProviders>
  );
}
