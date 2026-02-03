# Connorpedia

A custom Wikipedia-styled renderer for Connor's Obsidian vault. Built with Next.js and authentic Wikipedia Vector 2022 skin styling.

## Features

- 🎨 **Authentic Wikipedia Styling** - Faithful recreation of Wikipedia's Vector 2022 skin
- 📝 **Markdown Rendering** - Full support for markdown with frontmatter
- 🔗 **Dynamic Routing** - Clean URLs like `/wiki/article-name`
- 📚 **Vault Integration** - Reads directly from Obsidian vault directory
- ⚡ **Next.js Performance** - Fast, modern React framework with App Router

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/usagi-clawd/connorpedia.git
cd connorpedia

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
connorpedia/
├── app/
│   ├── globals.css          # Wikipedia Vector 2022 styling
│   ├── layout.tsx            # Root layout with header
│   ├── page.tsx              # Homepage
│   ├── not-found.tsx         # 404 page
│   └── wiki/
│       └── [[...slug]]/
│           └── page.tsx      # Dynamic wiki article pages
├── lib/
│   └── markdown.ts           # Markdown processing utilities
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Configuration

The vault directory is configured in `lib/markdown.ts`:

```typescript
const VAULT_PATH = '/home/usagi/clawd/vault';
```

Update this path to point to your Obsidian vault location.

## Creating Articles

Articles are standard markdown files in your vault directory:

```markdown
---
title: My Article Title
---

# My Article

Content goes here...
```

Access them at `/wiki/filename` (without the .md extension).

For nested articles, use subdirectories: `people/connor-daly.md` → `/wiki/people/connor-daly`

## Styling

The project uses authentic Wikipedia Vector 2022 skin CSS including:

- Signature Wikipedia blue links (#3366cc)
- Linux Libertine serif font for headings
- Sans-serif system fonts for body text
- Familiar Wikipedia layout and spacing
- Responsive sidebar navigation

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Custom CSS (Wikipedia Vector 2022)
- **Markdown**: remark + gray-matter
- **Rendering**: Server-side rendering (SSR)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## License

MIT

## Acknowledgments

- Wikipedia for the Vector 2022 skin design
- Next.js team for the excellent framework
- The Obsidian community for inspiration
