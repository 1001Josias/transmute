# BlueprintAI

AI-powered PRD & task management system.

## Overview

BlueprintAI transforms AI-generated PRDs (Product Requirements Documents) into beautiful, trackable tasks. AI agents create structured markdown files that are rendered in a premium web UI.

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
blueprint-ai/
├── content/
│   └── projects/           # Markdown files (PRDs + Tasks)
│       └── project-slug/
│           ├── prd.md
│           └── tasks.md
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   └── lib/                # Utilities and parsers
└── docs/
    └── agent-guide.md      # Instructions for AI agents
```

## For AI Agents

See [docs/agent-guide.md](docs/agent-guide.md) for detailed instructions on how to generate PRDs and tasks.

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **gray-matter** - Markdown frontmatter parsing
- **remark** - Markdown to HTML
- **Zod** - Schema validation
- **TypeScript** - Type safety

## License

MIT
