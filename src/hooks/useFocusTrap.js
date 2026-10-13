import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * Encierra Tab/Shift+Tab dentro de `containerRef` mientras `active` es true.
 * Opcional: Escape vía `onEscape` y devolver foco a `returnFocusRef`.
 */
export function useFocusTrap(active, containerRef, { onEscape, returnFocusRef } = {}) {
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return undefined;

    previouslyFocused.current = document.activeElement;
    const container = containerRef.current;

    const focusFirst = () => {
      const focusables = getFocusableElements(container);
      (focusables[0] ?? container).focus?.();
    };

    focusFirst();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const target = returnFocusRef?.current ?? previouslyFocused.current;
      target?.focus?.();
    };
  }, [active, containerRef, onEscape, returnFocusRef]);
}
