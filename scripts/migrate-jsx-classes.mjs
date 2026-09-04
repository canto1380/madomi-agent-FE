#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { bemToCamel } from './css-bem-to-camel.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../src');

function convertClassString(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (token.includes('${')) return token;
      if (!/[-__]/.test(token)) return token;
      return bemToCamel(token);
    })
    .join(' ');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // className="..."
  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    const converted = convertClassString(classes);
    if (converted !== classes) changed = true;
    return `className="${converted}"`;
  });

  // className='...'
  content = content.replace(/className='([^']+)'/g, (match, classes) => {
    const converted = convertClassString(classes);
    if (converted !== classes) changed = true;
    return `className='${converted}'`;
  });

  // Template literals with static parts - header--scrolled etc in ternary
  content = content.replace(/'([a-z][a-z0-9_-]*(?:__|--)[a-z0-9_-]*)'/g, (match, cls) => {
    const converted = bemToCamel(cls);
    if (converted !== cls) {
      changed = true;
      return `'${converted}'`;
    }
    return match;
  });

  if (changed) fs.writeFileSync(filePath, content);
  return changed;
}

function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += walk(full);
    else if (entry.name.endsWith('.jsx')) {
      if (processFile(full)) count += 1;
    }
  }
  return count;
}

console.log(`Archivos JSX actualizados: ${walk(srcDir)}`);
