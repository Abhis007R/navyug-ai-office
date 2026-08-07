import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Loader2
} from "lucide-react";
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://navyug-ai-office.onrender.com";


interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      sender: "bot",
      text: "Namaste! 🙏 Welcome to Navyug Jan Kalyan Foundation's AI Support. I can help you with student admissions, Section 80G tax exemptions, volunteer registrations, and CSR partnerships. Ask me anything!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  const suggestedQuestions = [
    "Is my donation 80G tax deduction eligible?",
    "How can I register a student for digital literacy?",
    "What subjects can I volunteer to teach?"
  ];

  const handleSendMessage = async (textToSend: string = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_BASE}/api/agent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "CHATBOT",
          task: trimmed,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setErrorMsg("Chatbot model is sleeping. Check that Port 3000 has your Gemini key.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Error connecting to chatbot API.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-indigo-600 text-white px-5 py-3.5 shadow-lg hover:bg-indigo-700 transition font-bold transform hover:scale-105"
        >
          <MessageSquare className="h-5 w-5 animate-pulse" />
          <span className="text-sm tracking-wide">Ask Navyug AI Chatbot</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between overflow-hidden animate-fade-in ring-1 ring-slate-950/5">
          
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-700 border border-indigo-500 relative">
                <MessageSquare className="h-4 w-4" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-indigo-600"></span>
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-wide">Navyug 24x7 Chatbot</h3>
                <p className="text-[10px] text-indigo-100 font-bold">Underprivileged Child Support Desk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-200 hover:text-white transition p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-55/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none font-bold"
                    : "bg-slate-100 text-slate-800 rounded-tl-none font-medium border border-slate-200"
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 px-1 font-bold">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="max-w-[80%] rounded-2xl p-3 bg-slate-100 text-slate-500 rounded-tl-none text-xs flex items-center gap-2 border border-slate-200">
                  <span className="pulse-slow font-bold">CHATBOT is processing response...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex gap-2.5 text-xs text-rose-800 animate-fade-in">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Helper Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-200 space-y-1 bg-white">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Click to test queries:</span>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-[10px] text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-950 px-2.5 py-1.5 rounded-lg font-bold transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Entry Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 border-t border-slate-200 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 font-medium bg-slate-50"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white p-2.5 shadow-sm transition flex items-center justify-center disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
