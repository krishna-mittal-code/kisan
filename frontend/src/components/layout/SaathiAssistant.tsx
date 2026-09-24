"use client";

import React, { startTransition, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Mic, X, Send, Loader2, AlertCircle } from "lucide-react";

/* =========================================================
   TYPES & INTERFACES
   ========================================================= */

interface SaathiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string; 
  diseaseContext?: unknown;
}

interface SpeechResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: SpeechResultEvent) => void;
  onerror: (event: SpeechErrorEvent) => void;
  onend: () => void;
  start: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface ChatMessage {
  sender: "user" | "saathi";
  text: string;
}

/* =========================================================
   LOCALIZATION DATA
   ========================================================= */

/* =========================================================
   COMPONENT
   ========================================================= */

export default function SaathiAssistant({
  isOpen,
  onClose,
  currentLanguage,
  diseaseContext,
}: SaathiAssistantProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uiError, setUiError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatMessages.length === 0) {
      startTransition(() => {
        setChatMessages([
          {
            sender: "saathi",
            text: t("saathi.greeting", "Namaste! I am Saathi."),
          },
        ]);
      });
    }
  }, [chatMessages.length, currentLanguage, t]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!isOpen) return null;

  /* =======================================================
     VOICE ASSISTANT (SPEECH RECOGNITION)
     ======================================================= */

  const startVoiceRecording = () => {
    setUiError(null);
    
    const browserWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setUiError(t("saathi.browserVoiceUnsupported"));
      return;
    }

    const recognition = new SpeechRecognition();
    
    if (currentLanguage === "hi") {
      recognition.lang = "hi-IN";
    } else if (currentLanguage === "gu") {
      recognition.lang = "gu-IN";
    } else {
      recognition.lang = "en-US";
    }

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: SpeechResultEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: SpeechErrorEvent) => {
      setIsRecording(false);
      setUiError(t("saathi.microphoneError", { error: event.error }));
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  /* =======================================================
     API INTEGRATION (Send Data to Backend)
     ======================================================= */

  async function fetchAiResponse(userMessage: string) {
    setIsLoading(true);
    setUiError(null);

    try {
      // Backend ko context aur data bheja ja raha hai
      const payload = {
        message: userMessage,
        language: currentLanguage,
        diseaseData: diseaseContext || null, 
      };

      
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI server.");
      }

      const data = (await response.json()) as { reply?: string };
      
      setChatMessages((current) => [
        ...current,
        {
          sender: "saathi",
          text: data.reply || t("saathi.unavailable"),
        },
      ]);
    } catch (error: unknown) {
      console.error("AI Assistant Error:", error);
      setChatMessages((current) => [
        ...current,
        {
          sender: "saathi",
          text: t("saathi.networkError"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  /* =======================================================
     MESSAGE HANDLING
     ======================================================= */

  function sendMessage(customQuestion?: string) {
    const message = customQuestion ?? question;
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    setChatMessages((current) => [
      ...current,
      {
        sender: "user",
        text: cleanMessage,
      },
    ]);

    setQuestion("");
    fetchAiResponse(cleanMessage);
  }

  /* =======================================================
     RENDER
     ======================================================= */

  const activeQuestions = [
    t("saathi.quickQuestions.irrigate"),
    t("saathi.quickQuestions.cropHealth"),
    t("saathi.quickQuestions.rain"),
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(2,6,23,0.60)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: "24px",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "390px",
          maxWidth: "100%",
          height: "min(650px, 82vh)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "18px",
          background: "linear-gradient(180deg, #11183b, #080d22)",
          border: "1px solid rgba(139,92,246,0.30)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(99,102,241,0.10)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "17px",
            borderBottom: "1px solid rgba(99,102,241,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "37px",
                height: "37px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "11px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                color: "#ffffff",
              }}
            >
              <Mic size={18} />
            </div>

            <div>
              <div style={{ color: "#ffffff", fontSize: "16px", fontWeight: 800 }}>
                Kisan Saathi
              </div>
              <div style={{ color: "#86efac", fontSize: "10px", marginTop: "2px" }}>
                ● AI ASSISTANT ONLINE
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: "8px",
              background: "rgba(100,116,139,0.10)",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>

        {uiError && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.15)",
              borderBottom: "1px solid rgba(220, 38, 38, 0.3)",
              padding: "10px 15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#fca5a5",
              fontSize: "16px",
            }}
          >
            <AlertCircle size={14} />
            {uiError}
          </div>
        )}

        {/* Style to hide scrollbar */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div 
          ref={chatContainerRef} 
          className="hide-scrollbar"
          style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: "15px",
            msOverflowStyle: "none",  /* IE and Edge */
            scrollbarWidth: "none",  /* Firefox */
          }}
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  padding: "10px 12px",
                  borderRadius:
                    message.sender === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  background:
                    message.sender === "user"
                      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                      : "rgba(30,41,75,0.75)",
                  border:
                    message.sender === "user" ? "none" : "1px solid rgba(99,102,241,0.10)",
                  color: "#e2e8f0",
                  fontSize: "16px",
                  lineHeight: 1.6,
                }}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "12px 12px 12px 3px",
                  background: "rgba(30,41,75,0.75)",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "16px",
                }}
              >
                <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                {t("saathi.thinking")}
              </div>
            </div>
          )}

          {!isLoading && (
            <div style={{ marginTop: "16px" }}>
              <div style={{ color: "#64748b", fontSize: "8px", marginBottom: "7px", textTransform: "uppercase" }}>
                {t("saathi.suggestedQuestions")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {activeQuestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => sendMessage(item)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(99,102,241,0.12)",
                      background: "rgba(99,102,241,0.04)",
                      color: "#94a3b8",
                      textAlign: "left",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: "12px", borderTop: "1px solid rgba(99,102,241,0.12)" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", gap: "7px", alignItems: "center" }}
          >
            <button
              type="button"
              onClick={startVoiceRecording}
              style={{
                width: "38px",
                height: "38px",
                border: "none",
                borderRadius: "9px",
                background: isRecording ? "rgba(239, 68, 68, 0.2)" : "rgba(100,116,139,0.12)",
                color: isRecording ? "#ef4444" : "#94a3b8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              <Mic size={16} />
            </button>

            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={isRecording ? t("saathi.listening") : t("saathi.placeholder")}
              disabled={isRecording}
              style={{
                flex: 1,
                minWidth: 0,
                padding: "10px 11px",
                borderRadius: "9px",
                border: "1px solid rgba(99,102,241,0.16)",
                background: "rgba(8,17,43,0.65)",
                color: "#e2e8f0",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              style={{
                width: "38px",
                height: "38px",
                border: "none",
                borderRadius: "9px",
                background: question.trim()
                  ? "linear-gradient(135deg, #161438, #7c3aed)"
                  : "rgba(100,116,139,0.12)",
                color: "#ffffff",
                cursor: question.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}