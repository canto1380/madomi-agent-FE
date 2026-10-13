import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Input } from '../../components/auth/ui/Input.jsx';
import { Button } from '../../components/auth/ui/Button.jsx';
import { Alert } from '../../components/auth/ui/Alert.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { resolvePostAuthPath } from '../../utils/authRedirect.js';

export function LoginPage() {
  const { login, autenticado, cargando } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = resolvePostAuthPath(location.state?.from?.pathname);

  const [form, setForm] = useState({ email: '', clave: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && autenticado) {
    return <Navigate to={destino} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await login(form);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresá con tu email y contraseña"
      footer={
        <>
          ¿No tenés cuenta? <Link to="/signup">Registrate</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Contraseña"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
          value={form.clave}
          onChange={handleChange}
        />

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </AuthLayout>
  );
}
