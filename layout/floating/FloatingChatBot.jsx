"use client";

import { useState } from "react";
import ChatBotPanel from "@/layout/floating/ChatBotPanel";
import "./FloatingChatBot.scss";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <div className="floating-chatbot" onClick={() => setOpen(true)}>
          💬 문의하기
        </div>
      )}

      {open && <ChatBotPanel onClose={() => setOpen(false)} />}
    </>
  );
}
