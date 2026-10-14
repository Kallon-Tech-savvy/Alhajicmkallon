'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

const ChatWidgetPanel = dynamic(
  () => import('./ChatWidget').then((module) => module.ChatWidget),
  { ssr: false },
);

/** Keep the site-wide launcher small; load chat UI and conversation logic on demand. */
export function ChatWidgetLoader() {
  const [open, setOpen] = useState(false);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        data-chat-launcher
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Ask a question about Alhaji"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-pride-blue)] text-white flex items-center justify-center shadow-2xl tap-scale hover-lift transition-transform duration-300"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
        </svg>
      </button>
      {open && <ChatWidgetPanel initialOpen showLauncher={false} onClose={closeChat} />}
    </>
  );
}
