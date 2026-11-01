import { useState } from 'react';
import { PageLayout } from '../../../components/admin/ui/PageLayout.jsx';
import { Alert } from '../../../components/admin/ui/Alert.jsx';
import { DataTable } from '../../../components/admin/ui/DataTable.jsx';
import { Badge } from '../../../components/admin/ui/Badge.jsx';
import { Button } from '../../../components/admin/ui/Button.jsx';
import { Input } from '../../../components/admin/ui/Input.jsx';
import {
  useAsistenteContextosAdmin,
  useAsistenteContextoVigenteAdmin,
} from '../../../hooks/admin/useAsistenteAdmin.js';
import { usePublicarContextoCrm } from '../../../hooks/admin/useCrmAdmin.js';
import { usePermisosUsuario } from '../../../hooks/usePermisosUsuario.js';
import { PERMISOS_COMERCIAL } from '../../../constants/permisosAdmin.js';
import { leerMensajeApi } from '../../../utils/apiMessage.js';

const TIPOS_CONTEXTO = [
  { value: 'politicas_entrega', label: 'Políticas de entrega' },
  { value: 'faq_comercial', label: 'FAQ comercial' },
  { value: 'tono_marca', label: 'Tono de marca' },
];

export default function ComercialContextoPage() {
  const [tipo, setTipo] = useState('politicas_entrega');
  const [version, setVersion] = useState('');
  const [markdown, setMarkdown] = useState('');
  const { puede } = usePermisosUsuario();
  const puedePublicar = puede(PERMISOS_COMERCIAL.CONTEXTO_PUBLICAR);

  const contextosQuery = useAsistenteContextosAdmin({ tipo, limit: 50 });
  const vigenteQuery = useAsistenteContextoVigenteAdmin(tipo);
  const publicarMutation = usePublicarContextoCrm();

  const columnas = [
    { key: 'version', header: 'Versión', sortable: false },
    { key: 'tipo', header: 'Tipo' },
    {
      key: 'vigenteDesde',
      header: 'Vigente desde',
      render: (row) => (row.vigenteDesde ? new Date(row.vigenteDesde).toLocaleString('es-AR') : '—'),
    },
    { key: 'chunksCount', header: 'Chunks' },
    {
      key: 'hash',
      header: 'Hash',
      render: (row) => (row.hash ? `${row.hash.slice(0, 10)}…` : '—'),
    },
  ];

  const publicar = async (event) => {
    event.preventDefault();
    await publicarMutation.mutateAsync({
      tipo,
      version: version.trim(),
      markdown: markdown.trim(),
    });
    setVersion('');
    contextosQuery.refetch();
    vigenteQuery.refetch();
  };

  return (
    <PageLayout
      title="Contexto del bot"
      description="Versiones de políticas y textos que usa el asistente (Mongo)."
    >
      {(contextosQuery.isError || vigenteQuery.isError) && (
        <Alert variant="error">
          {contextosQuery.error?.message ?? vigenteQuery.error?.message ?? 'Error al cargar contextos'}
        </Alert>
      )}
      {publicarMutation.isError && <Alert variant="error">{publicarMutation.error.message}</Alert>}
      {publicarMutation.isSuccess && (
        <Alert variant={publicarMutation.data?.duplicado ? 'info' : 'success'}>
          {leerMensajeApi(publicarMutation.data)
            || (publicarMutation.data?.duplicado
              ? 'Contexto ya vigente (mismo contenido)'
              : 'Contexto publicado')}
        </Alert>
      )}

      <div className="adminFilterBar adminFilterBar--inlineExtra">
        <div className="adminFilterBar__filter">
          <label className="adminFilterBar__label" htmlFor="contexto-tipo">
            Tipo
          </label>
          <select
            id="contexto-tipo"
            className="adminFilterBar__select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS_CONTEXTO.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {vigenteQuery.data && (
        <div className="adminDashboard__panel crmContextoVigente">
          <p>
            Vigente: versión <strong>{vigenteQuery.data.version}</strong>{' '}
            <Badge variant="success">{vigenteQuery.data.tipo}</Badge>
          </p>
          <details>
            <summary>Vista previa markdown</summary>
            <pre className="adminCodePreview">{vigenteQuery.data.markdown?.slice(0, 4000) ?? ''}</pre>
          </details>
        </div>
      )}

      {puedePublicar && (
        <form className="crmPublicarContexto" onSubmit={publicar}>
          <h2 className="crmDetailCard__title">Publicar nueva versión</h2>
          <Input
            label="Versión"
            name="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="ej. 2026-03-28"
            required
          />
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="markdownContexto">
              Markdown
            </label>
            <textarea
              id="markdownContexto"
              className="admin-field__input crmTextarea"
              rows={8}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              required
              minLength={10}
            />
          </div>
          <Button type="submit" disabled={publicarMutation.isPending}>
            {publicarMutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </form>
      )}

      <DataTable
        columns={columnas}
        data={contextosQuery.data ?? []}
        loading={contextosQuery.isLoading}
        emptyMessage="No hay versiones de contexto para este tipo."
      />
    </PageLayout>
  );
}
