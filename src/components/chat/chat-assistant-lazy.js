"use client";

import dynamic from "next/dynamic";

// The chat assistant is a floating widget that isn't needed for first paint,
// so its bundle (Gemini SDK, chat UI) loads after hydration.
const ChatAssistant = dynamic(() => import("./chat-assistant"), {
  ssr: false,
});

export default ChatAssistant;
