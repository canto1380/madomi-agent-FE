import { Badge } from '../ui/Badge.jsx';
import { etiquetaEstadoLead, variantEstadoLead } from '../../../utils/admin/crmCatalog.js';

export function LeadEstadoBadge({ estado }) {
  return <Badge variant={variantEstadoLead(estado)}>{etiquetaEstadoLead(estado)}</Badge>;
}
