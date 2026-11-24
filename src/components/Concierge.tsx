const exampleConversation = [
  {
    role: "user",
    text: "Thick, wavy hair and a round face. What should I get?",
  },
  {
    role: "assistant",
    text: "A textured crop with a low taper adds height and keeps the sides clean. Marcus specializes in it, and he has Thursday at 6:15 PM open. Shall I hold it?",
  },
] as const;

const suggestions = ["Hold Thu 6:15 PM", "Other times", "What does it cost?"];

export function Concierge() {
  return (
    <section
      id="concierge"
      aria-labelledby="concierge-heading"
      className="mx-auto flex max-w-site flex-col gap-14 px-5 py-24 md:flex-row md:items-center md:gap-20 md:px-8 md:py-36"
    >
      <div className="flex flex-col gap-6 md:flex-1">
        <p className="text-[0.6875rem] font-medium tracking-[0.3em] text-amber uppercase">
          The concierge · AI
        </p>
        <h2
          id="concierge-heading"
          className="font-display text-[clamp(2.5rem,1.75rem+3vw,3.75rem)] leading-[1.02] font-normal"
        >
          Not sure what
          <br />
          <em className="text-amber">to ask for?</em>
        </h2>
        <p className="max-w-[32em] text-stone">
          Describe your hair, your face shape or the look you&rsquo;re after.
          The concierge suggests a style, matches you with the right barber and
          finds a time that works, day or night.
        </p>
      </div>

      <div className="border border-line bg-card shadow-[0_2.5rem_5rem_rgba(0,0,0,0.5)] md:flex-1">
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
          aria-label="Example conversation"
          className="flex flex-col gap-4 p-6"
        >
          {exampleConversation.map((message, index) => (
            <li
              key={index}
              className={
                message.role === "user"
                  ? "max-w-[80%] self-end bg-line px-4 py-3.5 text-[0.9375rem]"
                  : "max-w-[86%] self-start border border-line px-4 py-3.5 text-[0.9375rem]"
              }
            >
              <span className="sr-only">
                {message.role === "user" ? "Guest:" : "Concierge:"}{" "}
              </span>
              {message.text}
            </li>
          ))}
        </ol>

        <ul
          aria-label="Suggested replies"
          className="flex flex-wrap gap-2 px-6 pb-6"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="border border-line px-4 py-3 text-[0.8125rem] text-stone"
            >
              {suggestion}
            </li>
          ))}
        </ul>

        <form className="flex items-center gap-3 border-t border-line px-6 py-3.5">
          <label htmlFor="concierge-input" className="sr-only">
            Message the concierge
          </label>
          <input
            id="concierge-input"
            type="text"
            disabled
            placeholder="Concierge coming soon…"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] placeholder:text-muted disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled
            aria-label="Send message"
            className="flex size-11 items-center justify-center bg-amber text-espresso disabled:opacity-40"
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
      </div>
    </section>
  );
}
