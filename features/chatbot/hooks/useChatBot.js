"use client";

import { useState, useEffect, useRef } from "react";
import { askChatbotAPI } from "@/features/chatbot/api/chatbotAPI";
import { useAuthStore } from "@/store/authStore"; // ⭐ 경로는 프로젝트에 맞게 조정

export function useChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", type: "text", text: "안녕하세요! 무엇을 도와드릴까요? 😊" }
  ]);
  const [input, setInput] = useState("");

  // ⭐ Zustand에서 바로 가져오기
  const userId = useAuthStore((state) => state.userId);

  const chatEndRef = useRef(null);

  // 자동 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const sendText = input;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { from: "me", type: "text", text: sendText }]);
    setInput("");

    try {
      const result = await askChatbotAPI({ userId, message: sendText });

      if (result.data) {
        // 주문 포함 응답
        setMessages(prev => [
          ...prev,
          { from: "bot", type: "text", text: result.reply },
          { from: "bot", type: "order", order: result.data }
        ]);
      } else {
        // 일반 응답
        setMessages(prev => [
          ...prev,
          { from: "bot", type: "text", text: result.reply }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { from: "bot", type: "text", text: "서버 오류가 발생했습니다." }
      ]);
    }
  };

  return { messages, input, setInput, sendMessage, chatEndRef };
}
