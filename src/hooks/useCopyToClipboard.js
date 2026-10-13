import { useCallback, useRef, useState } from 'react';

export function useCopyToClipboard(resetMs = 2200) {
  const [copiedKey, setCopiedKey] = useState(null);
  const timerRef = useRef(null);

  const copy = useCallback(
    async (text, key = 'default') => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedKey(null), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  const isCopied = useCallback((key) => copiedKey === key, [copiedKey]);

  return { copy, isCopied };
}
