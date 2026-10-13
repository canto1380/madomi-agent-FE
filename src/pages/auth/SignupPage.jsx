import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { Input } from '../../components/auth/ui/Input.jsx';
import { Button } from '../../components/auth/ui/Button.jsx';
import { Alert } from '../../components/auth/ui/Alert.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { DEFAULT_AUTH_DESTINO } from '../../utils/authRedirect.js';

export function SignupPage() {
  const { register, autenticado, cargando } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    clave: '',
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && autenticado) {
    return <Navigate to={DEFAULT_AUTH_DESTINO} replace />;
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
      await register(form);
      navigate(DEFAULT_AUTH_DESTINO, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo completar el registro');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completá tus datos para registrarte"
      footer={
        <>
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Nombre"
          name="nombre"
          autoComplete="given-name"
          required
          value={form.nombre}
          onChange={handleChange}
        />

        <Input
          label="Apellido"
          name="apellido"
          autoComplete="family-name"
          required
          value={form.apellido}
          onChange={handleChange}
        />

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
          autoComplete="new-password"
          required
          minLength={8}
          value={form.clave}
          onChange={handleChange}
        />

        <Button type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrarme'}
        </Button>
      </form>
    </AuthLayout>
  );
}
