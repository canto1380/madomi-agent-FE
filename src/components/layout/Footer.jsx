import { useMemo } from 'react';
import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { Logo } from '../ui/Logo.jsx';
import { RedSocialIcon, etiquetaRedSocial } from '../ui/RedSocialIcon.jsx';

export function Footer() {
  const { site } = useSiteContenido();
  const { nombreEmpresa, contacto, descripcion, tagline, nav, redes, footer } = site;
  const anio = new Date().getFullYear();

  const footerNav = useMemo(
    () => [
      { href: '#inicio', label: nav.inicio },
      { href: '#historia', label: nav.historia },
      { href: '#productos', label: nav.productos },
      { href: '#contacto', label: nav.contacto },
    ],
    [nav],
  );

  return (
    <footer className="footer">
      <div className="footerAccent" aria-hidden="true" />

      <div className="container footerGrid">
        <div className="footerBrand">
          <Logo variant="footer" />
          <p className="footerTagline">{tagline}</p>
          <p className="footerDesc">{descripcion}</p>
        </div>

        <nav className="footerNav" aria-label="Pie de página">
          <h3 className="footerHeading">{footer.seccionesTitulo}</h3>
          <ul className="footerNavList">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footerContact">
          <h3 className="footerHeading">{footer.contactoTitulo}</h3>
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
          <h3 className="footerHeading">
            {redes?.length ? footer.seguinosTitulo : footer.escribinosTitulo}
          </h3>
          {redes?.length > 0 ? (
            <ul className="footerRedesList">
              {redes.map((red) => (
                <li key={red.id}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={etiquetaRedSocial(red.plataforma)}
                    title={etiquetaRedSocial(red.plataforma)}
                  >
                    <RedSocialIcon plataforma={red.plataforma} />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footerCtaText">{footer.ctaTexto}</p>
          )}
          <a href={contacto.whatsapp} className="footerWhatsapp" target="_blank" rel="noreferrer">
            {footer.whatsapp}
          </a>
        </div>
      </div>

      <div className="footerBottom">
        <div className="container footerBottomInner">
          <p>
            © {anio} {nombreEmpresa}. {footer.copyright}
          </p>
          <p className="footerLocation">{footer.ubicacion}</p>
        </div>
      </div>
    </footer>
  );
}
