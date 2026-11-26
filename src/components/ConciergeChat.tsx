"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { services } from "@/data/services";
import { barbers } from "@/data/barbers";

const MAX_CHARS = 500;
const MAX_MESSAGES = 20; // Same limit as the server route.

const transport = new DefaultChatTransport({ api: "/api/concierge" });

const greeting =
  "Welcome to Sterling & Vane. Tell me about your hair or the look you’re after, and I’ll suggest a service and the right barber.";

const suggestions = [
  "What’s the difference between a cut and a fade?",
  "Who should I see for my beard?",
  "Are you open on Sundays?",
];

// Our own booking links, e.g. /book?service=skin-fade or /book?barber=marcus.
const bookingLink = /\/book\?(service|barber)=([a-z-]+)/g;

function getText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

// Pulls booking links out of a reply and turns them into button labels.
function splitReply(text: string) {
  const links: { href: string; label: string }[] = [];

  for (const [href, kind, slug] of text.matchAll(bookingLink)) {
    if (kind === "service") {
      const service = services.find((s) => s.slug === slug);
      if (service) links.push({ href, label: `Book ${service.name}` });
    } else {
      const barber = barbers.find((b) => b.slug === slug);
      if (barber)
        links.push({ href, label: `Book with ${barber.name.split(" ")[0]}` });
    }
  }

  const body = text
    .replace(bookingLink, "")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();

  return { body, links };
}

// The route sends { error: "…" }; show that text when there is one.
function getErrorMessage(error: Error) {
  try {
    const { error: message } = JSON.parse(error.message);
    if (typeof message === "string") return message;
  } catch {}
  return "Sorry, the concierge couldn’t reply just now.";
}

const bubble = "px-4 py-3.5 text-[0.9375rem] whitespace-pre-line";
const guestBubble = `${bubble} max-w-[80%] self-end bg-line`;
const conciergeBubble = `${bubble} max-w-[86%] self-start border border-line`;

export function ConciergeChat() {
  const { messages, sendMessage, status, error, regenerate, setMessages } =
    useChat({ transport });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLOListElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  // One more message would go over the server's limit.
  const isFull = messages.length >= MAX_MESSAGES - 1;

  // Keeps the newest message in view inside the chat box (not the page).
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, status]);

  function send(text: string) {
    const message = text.trim();
    if (!message || isBusy || isFull) return;
    void sendMessage({ text: message });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(input);
  }

  return (
    <div className="flex flex-col border border-line bg-card shadow-[0_2.5rem_5rem_rgba(0,0,0,0.5)] md:flex-1">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full border border-amber font-display text-lg text-amber"
        >
          S&amp;V
        </span>
        <div>
          <p className="text-[0.9375rem] font-normal">Concierge</p>
          <p className="text-xs text-stone">AI assistant</p>
        </div>
      </div>

      <ol
        ref={listRef}
        role="log"
        aria-label="Conversation with the concierge"
        aria-busy={isBusy}
        className="flex h-104 flex-col gap-4 overflow-y-auto p-6"
      >
        <li className={conciergeBubble}>
          <span className="sr-only">Concierge: </span>
          {greeting}
        </li>

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <li key={message.id} className={guestBubble}>
                <span className="sr-only">You: </span>
                {getText(message)}
              </li>
            );
          }

          const { body, links } = splitReply(getText(message));
          return (
            <li key={message.id} className="flex flex-col items-start gap-3">
              <p className={conciergeBubble}>
                <span className="sr-only">Concierge: </span>
                {body}
              </p>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-amber px-4 py-2.5 text-[0.8125rem] text-amber transition-colors hover:bg-amber hover:text-espresso"
                >
                  {link.label} →
                </Link>
              ))}
            </li>
          );
        })}

        {status === "submitted" && (
          <li className="flex items-center gap-1.5 self-start border border-line px-4 py-4">
            <span className="sr-only">Concierge is typing…</span>
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-stone motion-safe:animate-pulse"
            />
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-stone [animation-delay:150ms] motion-safe:animate-pulse"
            />
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-stone [animation-delay:300ms] motion-safe:animate-pulse"
            />
          </li>
        )}

        {error && (
          <li role="alert" className="self-start text-[0.9375rem] text-error">
            {getErrorMessage(error)}{" "}
            <button
              type="button"
              onClick={() => void regenerate()}
              className="underline underline-offset-4 hover:text-ivory"
            >
              Try again
            </button>
          </li>
        )}
      </ol>

      {messages.length === 0 && (
        <ul
          aria-label="Suggested questions"
          className="flex flex-wrap gap-2 px-6 pb-6"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => send(suggestion)}
                className="border border-line px-4 py-3 text-left text-[0.8125rem] text-stone transition-colors hover:border-amber hover:text-ivory"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isFull && (
        <p className="px-6 pb-6 text-[0.8125rem] text-stone">
          That’s the end of this conversation.{" "}
          <button
            type="button"
            onClick={() => setMessages([])}
            className="text-amber underline underline-offset-4"
          >
            Start a new one
          </button>
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-line px-6 py-3.5"
      >
        <label htmlFor="concierge-input" className="sr-only">
          Message the concierge
        </label>
        <input
          id="concierge-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={MAX_CHARS}
          disabled={isFull}
          autoComplete="off"
          placeholder="Ask about a cut, a shave or a barber…"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] placeholder:text-muted disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isBusy || isFull || !input.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center bg-amber text-espresso transition-colors hover:bg-amber-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>

      <p className="border-t border-line px-6 py-3 text-xs text-muted">
        AI replies can be wrong. Concept project; please confirm details with
        the shop.
      </p>
    </div>
  );
}
