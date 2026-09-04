/**
 * Convierte clases BEM/kebab-case a camelCase.
 * hero__layout--single → heroLayoutSingle
 * lo-ultimo → loUltimo
 */
export function bemToCamel(name) {
  const [block, modifier] = name.split('--');

  const toCamelSegment = (seg) =>
    seg
      .split('-')
      .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('');

  const convertBlock = (b) =>
    b
      .split('__')
      .map(toCamelSegment)
      .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
      .join('');

  if (modifier) {
    const mod = toCamelSegment(modifier);
    const base = convertBlock(block);
    return base + mod.charAt(0).toUpperCase() + mod.slice(1);
  }

  return convertBlock(block);
}

export function convertCssSelectors(css) {
  return css.replace(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g, (match, className) => {
    if (className.startsWith('field__input') || className === 'field__input') {
      // textarea.field__input handled as compound
    }
    const converted = bemToCamel(className);
    return `.${converted}`;
  });
}
