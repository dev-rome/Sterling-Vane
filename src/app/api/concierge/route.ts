import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { conciergeSystemPrompt } from "@/lib/concierge-prompt";

// Stop a slow reply after 30 seconds.
export const maxDuration = 30;

// Free-tier model on the AI Gateway. Changing models is this one line.
const MODEL = "nvidia/nemotron-3.5-lightning-free";

const MAX_MESSAGES = 20;
const MAX_CHARS = 500;

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await request.json());
  } catch {
    return badRequest("Invalid request.");
  }

  // Never trust the client: check shape, length and roles before paying for a model call.
  if (!Array.isArray(messages) || messages.length === 0) {
    return badRequest("No messages sent.");
  }
  if (messages.length > MAX_MESSAGES) {
    return badRequest("This conversation is too long. Please start a new one.");
  }
  if (messages.some((m) => m.role !== "user" && m.role !== "assistant")) {
    return badRequest("Invalid message.");
  }
  const tooLong = messages.some((m) =>
    m.parts.some((p) => p.type === "text" && p.text.length > MAX_CHARS),
  );
  if (tooLong) {
    return badRequest(`Please keep messages under ${MAX_CHARS} characters.`);
  }

  const result = streamText({
    model: MODEL,
    system: conciergeSystemPrompt,
    messages: await convertToModelMessages(messages),
    reasoning: "none", // A concierge reply doesn't need step-by-step thinking.
    maxOutputTokens: 600,
    onError: ({ error }) => console.error("[concierge]", error),
  });

  return createUIMessageStreamResponse({
    // Visitors only see the answer, never the model's thinking.
    stream: toUIMessageStream({ stream: result.stream, sendReasoning: false }),
  });
}
