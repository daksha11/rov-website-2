// components/ChatWidget.tsx
// Version: 2.0 - Enhanced markdown link parsing with debugging
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

// Component to render text with clickable links and markdown formatting
function MessageText({ text }: { text: string }) {
  // Parse inline elements (links, bold text) within a line
  const parseInline = (input: string): (string | JSX.Element)[] => {
    const elements: (string | JSX.Element)[] = [];
    let remaining = input;
    let keyCounter = 0;

    while (remaining.length > 0) {
      // 1. Bold markdown link: **[text](url)**
      const boldLinkMatch = remaining.match(/^\*\*\[([^\]]+)\]\s*\(([^)]+)\)\*\*/);
      if (boldLinkMatch) {
        elements.push(
          <strong key={`bl-${keyCounter++}`}>
            <a
              href={boldLinkMatch[2].trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-200 underline transition-colors font-semibold"
            >
              {boldLinkMatch[1]}
            </a>
          </strong>
        );
        remaining = remaining.slice(boldLinkMatch[0].length);
        continue;
      }

      // 2. Regular markdown link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\s*\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <a
            key={`l-${keyCounter++}`}
            href={linkMatch[2].trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // 3. HTML link: <a href="url">text</a>
      const htmlLinkMatch = remaining.match(/^<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i);
      if (htmlLinkMatch) {
        elements.push(
          <a
            key={`hl-${keyCounter++}`}
            href={htmlLinkMatch[1].trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline transition-colors"
          >
            {htmlLinkMatch[2]}
          </a>
        );
        remaining = remaining.slice(htmlLinkMatch[0].length);
        continue;
      }

      // 4. Plain URL: https://...
      const urlMatch = remaining.match(/^(https?:\/\/[^\s<)]+)/);
      if (urlMatch) {
        elements.push(
          <a
            key={`u-${keyCounter++}`}
            href={urlMatch[1]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline transition-colors"
          >
            {urlMatch[1]}
          </a>
        );
        remaining = remaining.slice(urlMatch[0].length);
        continue;
      }

      // 5. Bold text: **text**
      const boldMatch = remaining.match(/^\*\*([^*\n]+)\*\*/);
      if (boldMatch) {
        elements.push(
          <strong key={`b-${keyCounter++}`} className="font-semibold text-white">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // No pattern matched, consume text until next special character
      const nextSpecialChar = remaining.search(/[\[*<h]/);
      if (nextSpecialChar === -1) {
        if (remaining.length > 0) {
          elements.push(remaining);
        }
        break;
      } else if (nextSpecialChar === 0) {
        elements.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        elements.push(remaining.slice(0, nextSpecialChar));
        remaining = remaining.slice(nextSpecialChar);
      }
    }

    return elements;
  };

  // Parse the full text into block elements (headings, lists, paragraphs)
  const lines = text.split('\n');
  const blocks: JSX.Element[] = [];
  let lineKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Empty line - add spacing
    if (line.trim() === '') {
      blocks.push(<br key={`br-${lineKey++}`} />);
      continue;
    }

    // Heading: ### Text or ## Text or # Text
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      const HeadingTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;

      blocks.push(
        <HeadingTag
          key={`h-${lineKey++}`}
          className={`font-bold text-white ${
            level === 1 ? 'text-lg mt-4 mb-2' :
            level === 2 ? 'text-base mt-3 mb-2' :
            'text-sm mt-3 mb-1'
          }`}
        >
          {parseInline(headingText)}
        </HeadingTag>
      );
      continue;
    }

    // List item: - Text or * Text or + Text
    const listMatch = line.match(/^[\-\*\+]\s+(.+)$/);
    if (listMatch) {
      const listText = listMatch[1];
      blocks.push(
        <div key={`li-${lineKey++}`} className="flex gap-2 my-1">
          <span className="text-white/70 select-none flex-shrink-0">•</span>
          <span className="text-white/90">{parseInline(listText)}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    blocks.push(
      <div key={`p-${lineKey++}`} className="text-white/90">
        {parseInline(line)}
      </div>
    );
  }

  return <div className="space-y-1">{blocks}</div>;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Helper function to generate IDs (works in non-secure contexts like localhost on mobile)
  const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

  const [sessionId] = useState(() => generateId());
  const listRef = useRef<HTMLDivElement>(null);
  const lastRequestTime = useRef<number>(0);

  useEffect(() => {
    if (pathname === "/") {
      setIsVisible(false);
      const onLoaded = () => setIsVisible(true);
      const onLoading = () => setIsVisible(false);

      window.addEventListener("rov-home-loaded", onLoaded);
      window.addEventListener("rov-site-loaded", onLoaded);
      window.addEventListener("rov-site-loading", onLoading);

      return () => {
        window.removeEventListener("rov-home-loaded", onLoaded);
        window.removeEventListener("rov-site-loaded", onLoaded);
        window.removeEventListener("rov-site-loading", onLoading);
      };
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  async function sendMessage(messageText?: string) {
    const trimmed = messageText || input.trim();
    if (!trimmed || loading || cooldown) return;

    // Rate limiting: minimum 2 seconds between requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    const minDelay = 2000; // 2 seconds

    if (timeSinceLastRequest < minDelay) {
      const waitTime = Math.ceil((minDelay - timeSinceLastRequest) / 1000);
      const cooldownMsg: Msg = {
        id: generateId(),
        role: "assistant",
        text: `Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before sending another message.`,
      };
      setMessages((m) => [...m, cooldownMsg]);
      return;
    }

    lastRequestTime.current = now;
    setCooldown(true);

    const userMsg: Msg = { id: generateId(), role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId: sessionId
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat error");

      const reply = data?.output || data?.text || data?.message ||
        (typeof data === "string" ? data : JSON.stringify(data));

      const botMsg: Msg = {
        id: generateId(),
        role: "assistant",
        text: reply,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const botErr: Msg = {
        id: generateId(),
        role: "assistant",
        text: `Error: ${err.message || "Failed to receive response"}`,
      };
      setMessages((m) => [...m, botErr]);
    } finally {
      setLoading(false);
      // Reset cooldown after 2 seconds
      setTimeout(() => setCooldown(false), minDelay);
    }
  }

  function handleSampleQuestion(question: string) {
    sendMessage(question);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed bottom-28 md:bottom-6 right-6 h-14 w-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-black/80 overflow-hidden group z-[999999] transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
          aria-label="Open chat"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            <div className="shimmer-effect"></div>
          </div>
          <MessageCircle className="h-7 w-7 relative z-10" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[450px] max-w-[92vw] h-[600px] max-h-[85vh] rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 bg-black/60 backdrop-blur-3xl flex flex-col overflow-hidden z-[999999]">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-transparent text-white">
            <span className="font-semibold text-white/90" style={{ fontFamily: "Futura, sans-serif" }}>
              Range of View Studios
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent scrollbar-hide"
          >
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-sm text-white/60 font-medium px-2" style={{ fontFamily: "Futura, sans-serif" }}>
                  Hi! Ask me about our products, services, or support.
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={() => handleSampleQuestion("What is ROV?")}
                    className="w-full text-left px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm shadow-sm"
                    style={{ fontFamily: "Futura, sans-serif" }}
                  >
                    What is ROV?
                  </button>
                  <button
                    onClick={() => handleSampleQuestion("What services are provided by ROV?")}
                    className="w-full text-left px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm shadow-sm"
                    style={{ fontFamily: "Futura, sans-serif" }}
                  >
                    What services are provided by ROV?
                  </button>
                  <button
                    onClick={() => handleSampleQuestion("How to contact the ROV team?")}
                    className="w-full text-left px-5 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm shadow-sm"
                    style={{ fontFamily: "Futura, sans-serif" }}
                  >
                    How to contact the ROV team?
                  </button>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm max-w-[85%] shadow-sm ${m.role === "user"
                    ? "bg-white/10 backdrop-blur-md text-white border border-white/20"
                    : "bg-white/5 backdrop-blur-md text-white/95 border border-white/10"
                    }`}
                  style={{ fontFamily: "Futura, sans-serif" }}
                >
                  <MessageText text={m.text} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start px-2">
                <div className="text-xs text-white/40 animate-pulse" style={{ fontFamily: "Futura, sans-serif" }}>
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-transparent">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  rows={1}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-white/30 px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all min-h-[56px] max-h-[150px]"
                  style={{ fontFamily: "Futura, sans-serif" }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim() || cooldown}
                className="h-[56px] px-6 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white disabled:opacity-20 hover:bg-white/20 active:scale-95 transition-all shadow-lg"
              >
                <span className="font-semibold text-sm" style={{ fontFamily: "Futura, sans-serif" }}>Send</span>
              </button>
            </div>
            <div className="mt-3 px-1 text-[11px] text-white/30 tracking-wide" style={{ fontFamily: "Futura, sans-serif" }}>
              Enter to send • Shift+Enter for a new line
            </div>
          </div>
        </div>
      )}

      {/* Shimmer effect styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) rotate(15deg);
          }
          100% {
            transform: translateX(250%) rotate(15deg);
          }
        }

        .shimmer-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(10px);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
