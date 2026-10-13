import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.js';

export function ContactoCopyButton({ value, copyKey, label }) {
  const { copy, isCopied } = useCopyToClipboard();
  const copied = isCopied(copyKey);

  return (
    <button
      type="button"
      className={`contactoCopyBtn ${copied ? 'contactoCopyBtnDone' : ''}`}
      onClick={() => copy(value, copyKey)}
      aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}
