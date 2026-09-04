import { APP_CONSTANTS } from '../../constants/constants.js';
import { Logo } from '../ui/Logo.jsx';

const footerNav = [
  { href: '#inicio', label: APP_CONSTANTS.nav.inicio },
  { href: '#historia', label: APP_CONSTANTS.nav.historia },
  { href: '#productos', label: APP_CONSTANTS.nav.productos },
  { href: '#contacto', label: APP_CONSTANTS.nav.contacto },
];

export function Footer() {
  const { nombreEmpresa, contacto, descripcion } = APP_CONSTANTS;
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerAccent" aria-hidden="true" />

      <div className="container footerGrid">
        <div className="footerBrand">
          <Logo variant="footer" />
          <p className="footerTagline">{APP_CONSTANTS.tagline}</p>
          <p className="footerDesc">{descripcion}</p>
        </div>

        <nav className="footerNav" aria-label="Pie de página">
          <h3 className="footerHeading">Secciones</h3>
          <ul className="footerNavList">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footerContact">
          <h3 className="footerHeading">Contacto</h3>
          <ul className="footerContactList">
            <li>{contacto.direccion}</li>
            <li>
              <a href={`tel:${contacto.telefonoLink}`}>{contacto.telefono}</a>
            </li>
            <li>
              <a href={`mailto:${contacto.email}`}>{contacto.email}</a>
            </li>
            <li className="footerHorario">{contacto.horario}</li>
          </ul>
        </div>

        <div className="footerCta">
          <h3 className="footerHeading">Escribinos</h3>
          <p className="footerCtaText">Consultá por productos, distribución o pedidos.</p>
          <a href={contacto.whatsapp} className="footerWhatsapp" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="footerBottom">
        <div className="container footerBottomInner">
          <p>
            © {anio} {nombreEmpresa}. Todos los derechos reservados.
          </p>
          <p className="footerLocation">San Miguel de Tucumán, Tucumán · Argentina</p>
        </div>
      </div>
    </footer>
  );
}
