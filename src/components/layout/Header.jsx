import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useScrollHeader } from '../../hooks/useScrollHeader.js';
import { Logo } from '../ui/Logo.jsx';
import { RedSocialIcon, etiquetaRedSocial } from '../ui/RedSocialIcon.jsx';

const SECTION_IDS = ['inicio', 'historia', 'productos', 'contacto'];
const MOBILE_NAV_QUERY = '(max-width: 899px)';

export function Header() {
  const { site } = useSiteContenido();
  const { nav, contacto, nombreEmpresa, redes } = site;

  const navItems = useMemo(
    () => [
      { id: 'inicio', href: '#inicio', label: nav.inicio },
      { id: 'historia', href: '#historia', label: nav.historia },
      { id: 'productos', href: '#productos', label: nav.productos },
      { id: 'contacto', href: '#contacto', label: nav.contacto },
    ],
    [nav],
  );

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileNav, setMobileNav] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_NAV_QUERY).matches;
  });
  const scrolled = useScrollHeader(24);
  const activeSection = useActiveSection(SECTION_IDS);
  const menuShellRef = useRef(null);
  const toggleRef = useRef(null);

  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY);
    const onChange = (event) => {
      setMobileNav(event.matches);
      if (!event.matches) setMenuAbierto(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const menuActivo = menuAbierto && mobileNav;

  useBodyScrollLock(menuActivo);
  useFocusTrap(menuActivo, menuShellRef, {
    onEscape: cerrarMenu,
    returnFocusRef: toggleRef,
  });

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
          {redes?.length > 0 && (
            <>
              <span className="headerTopSep" aria-hidden="true">·</span>
              <span className="headerTopRedes">
                {redes.map((red) => (
                  <a
                    key={red.id}
                    href={red.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={etiquetaRedSocial(red.plataforma)}
                    title={etiquetaRedSocial(red.plataforma)}
                  >
                    <RedSocialIcon plataforma={red.plataforma} />
                  </a>
                ))}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="headerMain">
        <div className="container headerInner" ref={menuShellRef}>
          <a href="#inicio" className="headerBrand" onClick={cerrarMenu} aria-label={nombreEmpresa}>
            <Logo variant="header" />
          </a>

          <button
            ref={toggleRef}
            type="button"
            className={`headerToggle ${menuAbierto ? 'headerToggleOpen' : ''}`}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            aria-controls="header-nav-principal"
            onClick={() => setMenuAbierto((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="header-nav-principal"
            className={`headerNav ${menuAbierto ? 'headerNavOpen' : ''}`}
            aria-label="Principal"
            aria-hidden={mobileNav && !menuAbierto ? true : undefined}
          >
            <ul className="headerNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`headerLink ${activeSection === item.id ? 'headerLinkActive' : ''}`}
                    onClick={cerrarMenu}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                    tabIndex={mobileNav && !menuAbierto ? -1 : undefined}
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
              tabIndex={mobileNav && !menuAbierto ? -1 : undefined}
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
