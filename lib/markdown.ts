import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { remarkWikiLink } from './remark-wiki-link';
import { generateToc, renderToc, type TocItem } from './toc';

const VAULT_PATH = '/home/usagi/clawd/vault';

export interface Article {
  slug: string[];
  title: string;
  content: string;
  frontMatter: { [key: string]: any };
  toc: TocItem[];
  tocHtml: string;
}

/**
 * Add IDs to headings for anchor links
 */
function addHeadingIds(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1];
      const text = headingMatch[2];
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      result.push(`${level} ${text} {#${id}}`);
    } else {
      result.push(line);
    }
  }
  
  return result.join('\n');
}

/**
 * Add [edit] links to section headings (h2 and below)
 */
function addEditLinks(html: string): string {
  // Add edit link after each h2, h3, h4, h5, h6 (but not h1)
  return html.replace(
    /<(h[2-6])([^>]*)>(.+?)<\/\1>/gi,
    (match, tag, attrs, content) => {
      // Extract the id if it exists
      const idMatch = attrs.match(/id="([^"]+)"/);
      const id = idMatch ? idMatch[1] : '';
      
      return `<${tag}${attrs}>${content}<span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="#" onclick="event.preventDefault()">edit</a><span class="mw-editsection-bracket">]</span></span></${tag}>`;
    }
  );
}

export async function getArticleBySlug(slug: string[]): Promise<Article | null> {
  try {
    // Convert slug to file path
    const relativePath = slug.join('/');
    const fullPath = path.join(VAULT_PATH, `${relativePath}.md`);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    // Read the file
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter
    const { data, content } = matter(fileContents);

    // Generate table of contents
    const toc = await generateToc(content);
    const tocHtml = renderToc(toc);

    // Add heading IDs for anchor links
    const contentWithIds = addHeadingIds(content);

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(remarkWikiLink) // Process wiki-links first
      .use(remarkGfm) // Then GFM features
      .use(html, { sanitize: false })
      .process(contentWithIds);
    
    // Add edit links to section headings
    const contentHtml = addEditLinks(processedContent.toString());

    // Extract title from frontmatter or use slug
    const title = data.title || slug[slug.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      slug,
      title,
      content: contentHtml,
      frontMatter: data,
      toc,
      tocHtml,
    };
  } catch (error) {
    console.error('Error reading article:', error);
    return null;
  }
}

export function getAllArticles(): string[] {
  // This would recursively scan the vault directory
  // For now, return empty array - can be implemented later
  return [];
}
