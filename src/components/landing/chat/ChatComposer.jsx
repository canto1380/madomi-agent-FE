import { useState } from 'react';

const MAX_LEN = 4000;

export function ChatComposer({ onEnviar, disabled, placeholder = 'Escribí tu consulta…' }) {
  const [texto, setTexto] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const value = texto.trim();
    if (!value || disabled) return;
    onEnviar(value);
    setTexto('');
  };

  return (
    <form className="chatComposer" onSubmit={submit}>
      <label className="visuallyHidden" htmlFor="chatComposerInput">
        Mensaje para el asistente
      </label>
      <textarea
        id="chatComposerInput"
        className="chatComposerInput"
        rows={2}
        maxLength={MAX_LEN}
        value={texto}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit(e);
          }
        }}
      />
      <button type="submit" className="chatComposerSend btn btnPrimary" disabled={disabled || !texto.trim()}>
        Enviar
      </button>
    </form>
  );
}
