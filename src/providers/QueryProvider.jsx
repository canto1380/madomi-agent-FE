import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { notificarResultadoMutacion } from '../utils/admin/notificarAdmin.js';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (data, _variables, _context, mutation) => {
      notificarResultadoMutacion({ data, meta: mutation.meta });
    },
    onError: (error, _variables, _context, mutation) => {
      notificarResultadoMutacion({ error, meta: mutation.meta });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryProvider>
  );
}
