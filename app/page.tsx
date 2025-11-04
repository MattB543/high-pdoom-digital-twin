"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { personas } from "@/lib/personas";
import ReactMarkdown from "react-markdown";
import ConfirmModal from "./components/ConfirmModal";

export default function ChatPage() {
  const [selectedPersonaId] = useState("high-pdoom");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      streamProtocol: "text",
      body: {
        personaId: selectedPersonaId,
      },
      initialMessages: [
        {
          id: "greeting",
          role: "assistant",
          content:
            personas.find((p) => p.id === selectedPersonaId)?.greeting ||
            "Hello! How can I help you?",
        },
      ],
    });

  const handleNewConversation = () => {
    setShowConfirmModal(true);
  };

  const confirmNewConversation = () => {
    setShowConfirmModal(false);
    window.location.reload();
  };

  const cancelNewConversation = () => {
    setShowConfirmModal(false);
  };

  const currentPersona = personas.find((p) => p.id === selectedPersonaId);

  // Show loading indicator only before the assistant starts responding
  // Once the assistant message appears (even if still streaming), hide the loading indicator
  const hasUserMessages = messages.some((m) => m.role === "user");
  const lastMessage = messages[messages.length - 1];
  const isAssistantResponding = lastMessage?.role === "assistant" && lastMessage.id !== "greeting";
  const showLoadingIndicator = isLoading && hasUserMessages && !isAssistantResponding;

  return (
    <>
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Start a new conversation?"
        message="Current chat will be lost."
        confirmText="Start New"
        cancelText="Cancel"
        onConfirm={confirmNewConversation}
        onCancel={cancelNewConversation}
      />

      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-4 bg-white">
        <div className="max-w-[700px] mx-auto">
          <p className="text-lg text-gray-800 font-semibold text-center">
            Chat with our high P(doom) agent to hear why your safety plans will
            fail and everyone will die - unless we coordinate a global
            moratorium.
          </p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-[700px] mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } ${index === messages.length - 1 ? "animate-slideIn" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="flex gap-3 max-w-[95%]">
                  <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#f9fafb"
                      className="w-3.5 h-3.5"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  </div>
                  <div className="border border-gray-300 rounded-lg px-5 py-4 bg-white shadow-sm">
                    <div className="text-[15px] text-gray-800 leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-strong:text-gray-900 prose-strong:font-semibold">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {message.role === "user" && (
                <div className="bg-gray-900 text-gray-50 rounded-lg px-5 py-4 max-w-[95%] shadow-sm">
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {showLoadingIndicator && (
            <div className="flex justify-start animate-slideIn">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f9fafb"
                    className="w-3.5 h-3.5"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                </div>
                <div className="border border-gray-300 rounded-lg px-5 py-4 bg-white shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-[700px] mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
            {/* Input field - full width on mobile, flex-1 on desktop */}
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full md:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Buttons container - side by side on mobile, stays in row on desktop */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleNewConversation}
                className="flex-1 md:flex-none px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-lg flex items-center justify-center gap-2"
                title="New Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="text-[15px] font-medium">New Chat</span>
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-gray-50 rounded-lg hover:bg-gray-800 transition-colors font-medium text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 mt-1 text-center">
            You can drop a link in your chat and the agent will read it
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
