#!/usr/bin/env node
/**
 * Migra CSS BEM → camelCase y divide landing.css por sección.
 * Uso: node scripts/migrate-styles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bemToCamel, convertCssSelectors } from './css-bem-to-camel.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.join(__dirname, '../src/styles');
const landingPath = path.join(stylesDir, 'landing.css');
const globalPath = path.join(stylesDir, 'global.css');

const SECTIONS = [
  { start: 'HEADER', file: 'layout/header.css' },
  { start: 'HERO', file: 'sections/hero.css' },
  { start: 'HISTORIA', file: 'sections/historia.css' },
  { start: 'PRODUCTOS', file: 'sections/productos.css' },
  { start: 'CONTACTO', file: 'sections/contacto.css' },
  { start: 'FOOTER', file: 'layout/footer.css' },
];

function splitLanding(css) {
  const chunks = {};
  for (let i = 0; i < SECTIONS.length; i++) {
    const marker = SECTIONS[i].start;
    const next = SECTIONS[i + 1]?.start;
    const startIdx = css.indexOf(marker);
    const endIdx = next ? css.indexOf(next, startIdx + 1) : css.length;
    if (startIdx === -1) continue;
    const slice = css.slice(startIdx, endIdx === -1 ? css.length : endIdx);
    chunks[SECTIONS[i].file] = convertCssSelectors(slice);
  }
  return chunks;
}

function convertGlobal(css) {
  let out = css;

  const headerMobile = `
@media (max-width: 767px) {
  :root {
    --header-top-height: 0px;
  }

  .headerTop {
    display: none;
  }
}
`;

  out = out.replace(
    /@media \(max-width: 767px\) \{\s*:root \{\s*--header-top-height: 0px;\s*\}\s*\.header__top \{\s*display: none;\s*\}\s*\}/s,
    '',
  );

  out = convertCssSelectors(out);

  return { css: out, headerMobile: convertCssSelectors(headerMobile) };
}

function main() {
  const landing = fs.readFileSync(landingPath, 'utf8');
  const global = fs.readFileSync(globalPath, 'utf8');

  const chunks = splitLanding(landing);
  const { css: globalConverted, headerMobile } = convertGlobal(global);

  ['layout', 'sections', 'pages'].forEach((d) =>
    fs.mkdirSync(path.join(stylesDir, d), { recursive: true }),
  );

  Object.entries(chunks).forEach(([file, content]) => {
    const full = path.join(stylesDir, file);
    const header = `/* ${file} — clases camelCase */\n\n`;
    const body = file === 'layout/header.css' ? `${content}\n${headerMobile}` : content;
    fs.writeFileSync(full, `${header}${body.trim()}\n`);
  });

  fs.writeFileSync(globalPath, globalConverted);

  const indexCss = `@import './global.css';
@import './layout/header.css';
@import './layout/footer.css';
@import './sections/hero.css';
@import './sections/historia.css';
@import './sections/productos.css';
@import './sections/contacto.css';
`;

  fs.writeFileSync(path.join(stylesDir, 'index.css'), indexCss);

  console.log('Migración CSS completada.');
}

main();
