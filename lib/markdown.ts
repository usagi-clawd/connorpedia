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
      
      result.push(`${level} ${text}`);
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

export interface ArticleSummary {
  slug: string[];
  title: string;
  description?: string;
  frontMatter: { [key: string]: any };
}

export interface Backlink {
  slug: string[];
  title: string;
  context?: string;
}

/**
 * Check if a slug path corresponds to a directory (category)
 */
export function isCategory(slug: string[]): boolean {
  try {
    const relativePath = slug.join('/');
    const fullPath = path.join(VAULT_PATH, relativePath);
    
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Find all articles that link to the specified page (backlinks)
 */
export async function getBacklinks(targetSlug: string[]): Promise<Backlink[]> {
  const backlinks: Backlink[] = [];
  const targetPath = targetSlug.join('/');
  const targetTitle = targetSlug[targetSlug.length - 1];

  // Recursively scan vault for .md files
  function scanDirectory(dir: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...scanDirectory(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
    
    return files;
  }

  const allFiles = scanDirectory(VAULT_PATH);

  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      // Check if this file links to the target
      // Look for [[targetTitle]] or [[path/to/target]]
      const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
      let match;
      let hasBacklink = false;
      let context = '';
      
      while ((match = wikiLinkRegex.exec(content)) !== null) {
        const linkTarget = match[1].trim();
        
        // Check if the link matches our target (by title or path)
        if (linkTarget === targetTitle || 
            linkTarget === targetPath ||
            linkTarget.endsWith('/' + targetTitle)) {
          hasBacklink = true;
          
          // Extract context around the link
          const startIdx = Math.max(0, match.index - 50);
          const endIdx = Math.min(content.length, match.index + match[0].length + 50);
          context = '...' + content.substring(startIdx, endIdx).trim() + '...';
          break;
        }
      }
      
      if (hasBacklink) {
        // Convert file path to slug
        const relativePath = path.relative(VAULT_PATH, filePath);
        const slug = relativePath.replace(/\.md$/, '').split(path.sep);
        
        const title = data.title || slug[slug.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        backlinks.push({
          slug,
          title,
          context,
        });
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  return backlinks;
}

/**
 * Get page information including metadata and statistics
 */
export async function getPageInfo(slug: string[]): Promise<{
  article: Article;
  wordCount: number;
  characterCount: number;
  headingCount: number;
  linkCount: number;
  fileSize: number;
  lastModified: Date;
} | null> {
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return null;

    const relativePath = slug.join('/');
    const fullPath = path.join(VAULT_PATH, `${relativePath}.md`);
    const stats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(fileContents);

    // Calculate statistics
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const characterCount = content.length;
    const headingCount = (content.match(/^#{1,6}\s/gm) || []).length;
    const linkCount = (content.match(/\[\[([^\]]+)\]\]/g) || []).length;

    return {
      article,
      wordCount,
      characterCount,
      headingCount,
      linkCount,
      fileSize: stats.size,
      lastModified: stats.mtime,
    };
  } catch (error) {
    console.error('Error getting page info:', error);
    return null;
  }
}

/**
 * Get all articles in a category directory
 */
export async function getCategoryArticles(category: string): Promise<ArticleSummary[]> {
  try {
    const categoryPath = path.join(VAULT_PATH, category);
    
    if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
      return [];
    }

    const files = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .sort();

    const articles: ArticleSummary[] = [];

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract slug from filename (remove .md extension)
      const articleSlug = file.replace(/\.md$/, '');
      
      // Get title from frontmatter or generate from slug
      const title = data.title || articleSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Get description from frontmatter or extract from content
      let description = data.description || data.excerpt;
      
      if (!description) {
        // Extract first paragraph as description
        const paragraphs = content
          .split('\n\n')
          .filter(p => p.trim() && !p.startsWith('#'))
          .map(p => p.trim());
        
        if (paragraphs.length > 0) {
          description = paragraphs[0]
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
            .replace(/\[\[([^\]]+)\]\]/g, '$1') // Remove wiki links
            .replace(/[#*_`]/g, '') // Remove markdown formatting
            .substring(0, 200);
          
          if (content.length > 200) {
            description += '...';
          }
        }
      }

      articles.push({
        slug: [category, articleSlug],
        title,
        description,
        frontMatter: data,
      });
    }

    return articles;
  } catch (error) {
    console.error('Error reading category articles:', error);
    return [];
  }
}
