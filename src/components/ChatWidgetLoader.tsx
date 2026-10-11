'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { MessageCircle } from 'lucide-react';

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
        <MessageCircle size={22} />
      </button>
      {open && <ChatWidgetPanel initialOpen showLauncher={false} onClose={closeChat} />}
    </>
  );
}
