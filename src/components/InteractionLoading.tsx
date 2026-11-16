'use client';

import { createContext, useContext, useEffect, useRef } from 'react';

export const InteractionLoadingContext = createContext<{
  kind: 'search' | 'chat';
  open: boolean;
  onClose: () => void;
} | null>(null);

/** Immediate, dismissible feedback while an optional interaction downloads. */
export function InteractionLoading() {
  const state = useContext(InteractionLoadingContext);
  const closeButton = useRef<HTMLButtonElement>(null);
  const open = state?.open;
  const onClose = state?.onClose;

  useEffect(() => {
    if (!open || !onClose) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      // Restore the trigger before the loaded dialog takes focus.
      trigger?.focus();
    };
  }, [open, onClose]);

  if (!state?.open) return null;
  const chat = state.kind === 'chat';
  return (
    <div
      id={chat ? 'chat-panel' : undefined}
      role="dialog"
      aria-label={chat ? 'Loading chat' : 'Loading search'}
      aria-busy="true"
      className={
        chat
          ? 'fixed bottom-24 right-4 z-[70] w-[calc(100%-2rem)] max-w-sm border border-border bg-surface p-6 text-ivory shadow-xl'
          : 'fixed left-4 right-4 top-24 z-[70] mx-auto max-w-xl border border-border bg-surface p-6 text-ivory shadow-xl'
      }
    >
      <button
        ref={closeButton}
        type="button"
        onClick={state.onClose}
        className="ui-secondary float-right"
      >
        Close
      </button>
      <p role="status">Loading {state.kind}…</p>
    </div>
  );
}
