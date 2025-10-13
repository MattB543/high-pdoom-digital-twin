import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToCoreMessages } from "ai";
import { getPersonaById } from "@/lib/personas";
import { processMessageWithUrls, extractUrls } from "@/lib/url-reader";

export const runtime = "edge"; // Optional: Use edge runtime for faster responses

export async function POST(req: Request) {
  try {
    const { messages, personaId: incomingPersonaId } = await req.json();

    // Get persona from request data
    const personaId = incomingPersonaId || "high-pdoom";
    const persona = getPersonaById(personaId);

    if (!persona) {
      return new Response("Persona not found", { status: 404 });
    }

    // Process URLs in user messages - fetch content from Jina Reader API
    const processedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        if (
          msg.role === "user" &&
          msg.content &&
          typeof msg.content === "string"
        ) {
          const urls = extractUrls(msg.content);
          if (urls.length > 0) {
            // Fetch URL content and append to message
            const enhancedContent = await processMessageWithUrls(msg.content);
            return { ...msg, content: enhancedContent };
          }
        }
        return msg;
      })
    );

    // Initialize OpenRouter
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      extraBody: {
        reasoning: {
          effort: "low",
        },
      },
    });

    // Use the persona's model (no need for :online suffix, we fetch URL content ourselves)
    const modelName = persona.modelName;
    const model = openrouter(modelName);

    // Stream response from OpenRouter with processed messages
    const result = await streamText({
      model: model as any,
      system: persona.systemPrompt,
      messages: convertToCoreMessages(processedMessages),
      temperature: 0.7,
      maxTokens: 10000,
    });

    // Return text streaming response (compatible with streamProtocol: 'text')
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
