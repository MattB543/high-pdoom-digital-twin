# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 15 chatbot application featuring an AI safety persona with a "High p(doom)" perspective on artificial superintelligence. Built with the Vercel AI SDK and OpenRouter, it demonstrates real-time streaming chat with URL content extraction capabilities.

## Development Commands

```bash
# Start development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Core Technology Stack
- **Framework**: Next.js 15 (App Router)
- **AI Integration**: Vercel AI SDK v3.4 with `@ai-sdk/react` hooks
- **AI Provider**: OpenRouter (via `@openrouter/ai-sdk-provider`)
- **Styling**: Tailwind CSS with `@tailwindcss/typography` for markdown
- **Markdown**: react-markdown for rendering assistant responses

### Key Architectural Patterns

**1. Streaming Chat Pattern**
The app uses Vercel AI SDK's `useChat` hook which handles:
- Message state management
- Streaming responses from the API
- Input handling and form submission
- Loading states

**2. URL Content Extraction**
When users include URLs in messages, the app:
- Detects URLs using regex in lib/url-reader.ts
- Fetches content via Jina Reader API (`https://r.jina.ai/{url}`)
- Converts web pages to markdown
- Appends content to the message context (max 8000 chars)
- Processes all URLs in parallel

**3. Persona System**
Defined in lib/personas.ts:
- Each persona has: id, name, description, systemPrompt, greeting, avatar, modelName
- Currently implements one persona: "high-pdoom" AI safety advocate
- System prompt (~450 lines) defines worldview, arguments, communication style
- Easy to extend by adding new persona objects to the array

### File Structure

```
app/
├── api/chat/route.ts       # Edge API route: processes messages, fetches URLs, streams responses
├── components/
│   └── ConfirmModal.tsx    # Reusable modal component for confirmations
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Main chat UI component
└── globals.css             # Tailwind imports

lib/
├── personas.ts             # Persona configuration and system prompts
└── url-reader.ts           # URL detection and Jina Reader API integration
```

### API Route Flow (app/api/chat/route.ts)

1. Receives messages array and personaId from frontend
2. Looks up persona configuration
3. **URL Processing**: For each user message, detects URLs and fetches content from Jina Reader API
4. Passes processed messages to OpenRouter via Vercel AI SDK's `streamText`
5. Returns streaming response via `toAIStreamResponse()`

Note: Uses Edge Runtime for faster cold starts

### Frontend Flow (app/page.tsx)

1. `useChat` hook connects to `/api/chat` endpoint
2. Initial greeting message loaded from persona configuration
3. User messages styled with dark background (right-aligned)
4. Assistant messages render markdown with prose styling (left-aligned, with avatar)
5. Loading indicator only shows before first user message is sent
6. "New Chat" button triggers confirmation modal and reloads page

## Environment Variables

Required in `.env.local` (never committed):
```bash
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE
```

Get API keys at: https://openrouter.ai/keys

## Adding New Personas

Edit `lib/personas.ts` and add to the `personas` array:

```typescript
{
  id: 'your-id',
  name: 'Display Name',
  description: 'Brief description',
  systemPrompt: 'Detailed instructions for AI behavior...',
  greeting: 'Initial message to user',
  avatar: '🤖',
  modelName: 'openai/gpt-4o-mini' // Any OpenRouter model
}
```

Note: The frontend currently hardcodes `selectedPersonaId` to "high-pdoom" (line 10 of app/page.tsx). To enable persona switching, uncomment the persona selector in the header section.

## URL Reading Feature

The app automatically detects URLs in user messages and fetches their content:
- Uses Jina Reader API (no API key required)
- Converts HTML to clean markdown
- Truncates at 8000 characters to avoid context overflow
- Fetches multiple URLs in parallel
- Gracefully handles failures (shows error message but continues)

This provides context-aware responses without requiring OpenRouter's `:online` suffix.

## Model Configuration

Currently uses: `openai/gpt-5-mini` (lib/personas.ts line 457)
- Can be changed to any OpenRouter-supported model
- Temperature: 0.7
- Max tokens: 1000

## Styling Conventions

- Max content width: 700px (centered)
- Message text: 15px font size
- Color scheme: Gray-900 (dark) and Gray-50 (light) for primary UI
- Assistant messages use prose typography plugin for markdown formatting
- Loading animation: Three bouncing dots with staggered delays

## Important Notes

- Messages are not persisted (in-memory only during session)
- No authentication or user management
- Page reload is used to reset conversation state
- Edge runtime requires careful handling of Node.js APIs (use only browser-compatible code)
- The system prompt for "high-pdoom" persona is ~450 lines and contains detailed argumentation frameworks

## Deployment

Designed for Vercel deployment:
1. Push to GitHub
2. Import repository in Vercel dashboard
3. Add `OPENROUTER_API_KEY` environment variable
4. Deploy

Free tier usage estimate:
- Vercel: 100GB bandwidth/month, 100hrs serverless execution
- OpenRouter (GPT-4o-mini): ~$0.0004 per conversation
- Total: <$5/month for moderate usage
