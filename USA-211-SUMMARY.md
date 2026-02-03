# USA-211: Markdown Renderer with Wiki-Link Support

## Summary
Implemented a full-featured markdown renderer for Connorpedia with Obsidian-style wiki-link support, automatic table of contents, and frontmatter display.

## Features Implemented

### ✅ Wiki-Link Support
- **Basic links**: `[[page-name]]` → converts to `/wiki/page-name`
- **Aliased links**: `[[page-name|Display Text]]` → displays as "Display Text" 
- **Smart resolution**: Resolves links to actual files in vault regardless of subfolder
- **Red links**: Missing pages styled in red (Wikipedia-style) with proper 404 handling
- **Case-insensitive**: Links work with different casing and space/hyphen variations

### ✅ Table of Contents
- Auto-generated from heading structure (H2-H6)
- Hierarchical/nested TOC based on heading levels
- Wikipedia-style collapsible design
- Click title to expand/collapse
- Anchor links to each section
- Responsive design

### ✅ Frontmatter Display
- Parses YAML frontmatter from markdown files
- Displays metadata in Wikipedia-style info box
- Floats on right side of content (desktop) or full-width (mobile)
- Shows: type, created date, tags, and any custom fields
- Clean table layout

### ✅ Standard Markdown Features
- Headers with auto-generated IDs for anchor links
- Lists (ordered and unordered)
- Blockquotes
- Code blocks (inline and fenced)
- Tables (via remark-gfm)
- Bold, italic, strikethrough
- Images and external links

### ✅ Page Index System
- Built vault-wide page index on server startup
- Maps page names to file paths for fast wiki-link resolution
- Handles pages in any subfolder
- Multiple lookup strategies (filename only, full path)

### ✅ Enhanced UX
- Beautiful Wikipedia Vector 2022 styling
- Proper 404 pages with helpful messaging
- Mobile-responsive design
- Clean typography and spacing
- Collapsible TOC for better reading experience

## Technical Implementation

### New Files
- `lib/vault-index.ts` - Scans vault and builds page index for link resolution
- `lib/remark-wiki-link.ts` - Custom remark plugin for wiki-link syntax
- `lib/toc.ts` - Table of contents generation from markdown AST
- `app/components/FrontMatter.tsx` - Displays YAML frontmatter metadata
- `app/components/TableOfContents.tsx` - Interactive collapsible TOC component

### Modified Files
- `lib/markdown.ts` - Enhanced to use new plugins and generate TOC
- `app/wiki/[[...slug]]/page.tsx` - Updated to display TOC and frontmatter
- `app/globals.css` - Added styles for wiki-links, TOC, and frontmatter
- `package.json` - Added dependencies: unist-util-visit, rehype-slug, rehype-autolink-headings

### Architecture
1. **Build phase**: Vault index scanned to map all pages
2. **Parse phase**: Wiki-links detected and resolved via remark plugin
3. **Transform phase**: Links converted to proper Next.js routes
4. **Render phase**: TOC and frontmatter displayed alongside content

## Testing

All test pages work correctly:
- ✅ http://localhost:3000/wiki/people/connor-daly
- ✅ http://localhost:3000/wiki/ideas/the-friendship-pipeline  
- ✅ http://localhost:3000/wiki/projects/cocktail-journey-book

### Verified Features
- ✅ Wiki-links resolve correctly (e.g., `[[nhu-hoang]]` → `/wiki/people/nhu-hoang`)
- ✅ Aliased links display properly (e.g., `[[nhu-hoang|Nhu's]]` → "Nhu's")
- ✅ TOC generates with proper hierarchy
- ✅ Frontmatter displays in info box
- ✅ Anchor links work for navigation
- ✅ 404 pages show helpful message
- ✅ Mobile responsive design works
- ✅ Tables render properly
- ✅ Code blocks styled correctly

## Next Steps
1. Merge this PR
2. Consider adding:
   - Search functionality across vault
   - Backlinks (pages that link to current page)
   - Graph view of page connections
   - Edit mode for quick updates
   - Recently viewed pages

## Notes
- All wiki-links tested resolve correctly
- Red link styling ready for future pages that don't exist yet
- TOC is collapsible for better UX
- Frontmatter parsing handles any YAML fields flexibly
- Design matches Wikipedia aesthetic as requested
