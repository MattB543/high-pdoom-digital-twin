# High p(doom) Digital Twin Chatbot

A Next.js chatbot application that embodies AI safety perspectives, built with the Vercel AI SDK and OpenRouter.

## Features

- Real-time streaming chat interface
- Persona-based AI responses
- "High p(doom)" AI safety advocate persona
- Clean, responsive UI with Tailwind CSS
- Web search capability (automatic URL detection)
- Easy to extend with additional personas

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI SDK**: Vercel AI SDK (v3.4)
- **AI Provider**: OpenRouter
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenRouter API key (get one at [openrouter.ai/keys](https://openrouter.ai/keys))

### Installation

1. **Set up your OpenRouter API key**:

   Edit `.env.local` and add your API key:
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-YOUR_API_KEY_HERE
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
high-pdoom-digital-twin/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Backend API (streams to OpenRouter)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Chat interface
│   └── globals.css               # Tailwind imports
├── lib/
│   └── personas.ts               # Persona configuration
├── .env.local                    # API key (not committed)
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Adding New Personas

To add a new persona, edit `lib/personas.ts` and add a new entry to the `personas` array:

```typescript
{
  id: 'your-persona-id',
  name: 'Your Persona Name',
  description: 'Brief description',
  systemPrompt: 'Detailed system prompt defining the persona behavior...',
  greeting: 'Initial greeting message',
  avatar: '🤖', // Emoji or icon
  modelName: 'openai/gpt-4o-mini' // OpenRouter model
}
```

The new persona will automatically appear in the dropdown selector.

## Usage Notes

### Web Search
The chatbot automatically enables web search when URLs are detected in user messages by adding the `:online` suffix to the model name.

### New Conversations
Click the "New Chat" button to start a fresh conversation. Current chat history is not persisted.

### Persona Switching
Changing personas resets the conversation to ensure consistent context.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable: `OPENROUTER_API_KEY`
   - Deploy!

### Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variable
vercel env add OPENROUTER_API_KEY production
```

## Cost Estimate

**Vercel Free Tier:**
- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- Sufficient for thousands of conversations

**OpenRouter (GPT-4o-mini):**
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens
- ~$0.0004 per typical conversation
- 1,000 conversations ≈ $0.40

**Total: < $5/month for moderate usage**

## Security Notes

- API keys are stored in `.env.local` and never exposed to the frontend
- The `.gitignore` file ensures `.env.local` is not committed
- All AI requests are proxied through the Next.js API route

## Troubleshooting

### "API key not found" error
- Ensure `.env.local` exists and contains `OPENROUTER_API_KEY=...`
- Restart the dev server after adding `.env.local`

### Build failures
- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is 18 or higher

### CORS errors
- Should not occur with Next.js (same origin)
- If deploying elsewhere, ensure API route has proper CORS headers

## Optional Enhancements

Consider adding:
- Markdown rendering for formatted responses
- Code syntax highlighting
- Dark mode toggle
- Conversation export (JSON/text)
- Local storage for chat history
- Voice input/output
- Message timestamps
- Copy message button

## License

MIT

## Support

For issues and questions, please check the implementation plan in `IMPLEMENTATION_PLAN.md`.
