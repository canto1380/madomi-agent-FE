import { useSiteContenido } from '../../providers/SiteContenidoProvider.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { ContactoCopyButton } from './ContactoCopyButton.jsx';

const MAPA_EMBED =
  'https://maps.google.com/maps?q=Rivadavia+1891,+San+Miguel+de+Tucum%C3%A1n,+Tucum%C3%A1n&z=15&output=embed';

export function ContactoSection() {
  const { site } = useSiteContenido();
  const { contactoSection, contacto } = site;

  const items = [
    {
      id: 'ubicacion',
      titulo: 'Ubicación',
      valor: contacto.direccion,
    },
    {
      id: 'telefono',
      titulo: 'Teléfono',
      valor: contacto.telefono,
      copyValue: contacto.telefono,
      href: `tel:${contacto.telefonoLink}`,
      detalle: contacto.horario,
    },
    {
      id: 'email',
      titulo: 'Email',
      valor: contacto.email,
      copyValue: contacto.email,
      href: `mailto:${contacto.email}`,
    },
  ];

  return (
    <section id="contacto" className="contacto section sectionCompact">
      <div className="container">
        <Reveal>
          <div className="sectionHeader sectionHeaderCompact">
            <span className="sectionEyebrow">Estamos cerca</span>
            <h2 className="sectionTitle">{contactoSection.titulo}</h2>
            <p className="sectionSubtitle">{contactoSection.subtitulo}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="contactoPanel">
            <div className="contactoDatos">
              <ul className="contactoTiles">
                {items.map((item) => (
                  <li key={item.id} className="contactoTile">
                    <span className="contactoTileLabel">{item.titulo}</span>
                    <div className="contactoTileValorRow">
                      {item.href ? (
                        <a href={item.href} className="contactoTileValor">
                          {item.valor}
                        </a>
                      ) : (
                        <p className="contactoTileValor">{item.valor}</p>
                      )}
                      {item.copyValue && (
                        <ContactoCopyButton
                          value={item.copyValue}
                          copyKey={item.id}
                          label={item.titulo.toLowerCase()}
                        />
                      )}
                    </div>
                    {item.detalle && <p className="contactoTileDetalle">{item.detalle}</p>}
                  </li>
                ))}
              </ul>

              <a
                href={contacto.whatsapp}
                className="contactoWhatsapp"
                target="_blank"
                rel="noreferrer"
              >
                Chatear por WhatsApp
              </a>
            </div>

            <div className="contactoMapa">
              <iframe
                title="Ubicación de Madomi Pastas"
                src={MAPA_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
