import { useState } from 'react';
import { APP_CONSTANTS } from '../../constants/constants.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { useScrollHeader } from '../../hooks/useScrollHeader.js';
import { Logo } from '../ui/Logo.jsx';

const SECTION_IDS = ['inicio', 'historia', 'productos', 'contacto'];

const navItems = [
  { id: 'inicio', href: '#inicio', label: APP_CONSTANTS.nav.inicio },
  { id: 'historia', href: '#historia', label: APP_CONSTANTS.nav.historia },
  { id: 'productos', href: '#productos', label: APP_CONSTANTS.nav.productos },
  { id: 'contacto', href: '#contacto', label: APP_CONSTANTS.nav.contacto },
];

export function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const scrolled = useScrollHeader(24);
  const activeSection = useActiveSection(SECTION_IDS);
  const { contacto, nombreEmpresa } = APP_CONSTANTS;

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className={`header ${scrolled ? 'headerScrolled' : ''}`}>
      <div className="headerTop">
        <div className="container headerTopInner">
          <a href={`tel:${contacto.telefonoLink}`} className="headerTopLink">
            <span className="headerTopIcon" aria-hidden="true">☎</span>
            {contacto.telefono}
          </a>
          <span className="headerTopSep" aria-hidden="true">·</span>
          <span className="headerTopHours">{contacto.horario}</span>
        </div>
      </div>

      <div className="headerMain">
        <div className="container headerInner">
          <a href="#inicio" className="headerBrand" onClick={cerrarMenu} aria-label={nombreEmpresa}>
            <Logo variant="header" />
          </a>

          <button
            type="button"
            className={`headerToggle ${menuAbierto ? 'headerToggleOpen' : ''}`}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`headerNav ${menuAbierto ? 'headerNavOpen' : ''}`} aria-label="Principal">
            <ul className="headerNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`headerLink ${activeSection === item.id ? 'headerLinkActive' : ''}`}
                    onClick={cerrarMenu}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={contacto.whatsapp}
              className="headerCta"
              target="_blank"
              rel="noreferrer"
              onClick={cerrarMenu}
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
