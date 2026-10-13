import { SiteContenidoProvider } from '../providers/SiteContenidoProvider.jsx';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { HeroSection } from '../components/landing/HeroSection.jsx';
import { HistoriaSection } from '../components/landing/HistoriaSection.jsx';
import { ProductosSection } from '../components/landing/ProductosSection.jsx';
import { ContactoSection } from '../components/landing/ContactoSection.jsx';
import { WhatsappFloat } from '../components/landing/WhatsappFloat.jsx';
import { ChatWidget } from '../components/landing/chat/ChatWidget.jsx';

export function LandingPage() {
  return (
    <SiteContenidoProvider>
      <a href="#contenido-principal" className="skipLink">
        Saltar al contenido principal
      </a>

      <Header />

      <main id="contenido-principal" tabIndex={-1}>
        <HeroSection />
        <HistoriaSection />
        <ProductosSection />
        <ContactoSection />
      </main>

      <Footer />
      <ChatWidget />
      <WhatsappFloat />
    </SiteContenidoProvider>
  );
}
