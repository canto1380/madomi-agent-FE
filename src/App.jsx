import { AppProviders } from './providers/QueryProvider.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import './styles/index.css';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
