import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { HeroSection } from '../components/landing/HeroSection.jsx';
import { HistoriaSection } from '../components/landing/HistoriaSection.jsx';
import { ProductosSection } from '../components/landing/ProductosSection.jsx';
import { ContactoSection } from '../components/landing/ContactoSection.jsx';

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HistoriaSection />
        <ProductosSection />
        <ContactoSection />
      </main>
      <Footer />
    </>
  );
}
