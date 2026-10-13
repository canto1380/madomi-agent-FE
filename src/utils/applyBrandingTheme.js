import { APP_CONSTANTS } from '../constants/constants.js';

const BRANDING_VARS = {
  '--color-primario': 'colorPrimario',
  '--color-primario-oscuro': 'colorPrimarioOscuro',
  '--color-secundario': 'colorSecundario',
  '--color-acento': 'colorAcento',
  '--color-fondo': 'colorFondo',
  '--color-fondo-oscuro': 'colorFondoOscuro',
  '--color-texto': 'colorTexto',
  '--color-texto-claro': 'colorTextoClaro',
  '--color-error': 'colorError',
  '--color-exito': 'colorExito',
};

export function applyBrandingTheme(branding = APP_CONSTANTS.branding) {
  const root = document.documentElement;

  Object.entries(BRANDING_VARS).forEach(([cssVar, key]) => {
    if (branding?.[key]) {
      root.style.setProperty(cssVar, branding[key]);
    }
  });
}
