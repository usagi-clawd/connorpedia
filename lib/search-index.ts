import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const VAULT_PATH = '/home/usagi/clawd/vault';

export interface SearchableArticle {
  title: string;
  slug: string[];
  category: string;
  content: string;
  excerpt: string;
  tags: string[];
  filePath: string;
}

/**
 * Build a search index of all articles in the vault
 * Returns an array of searchable articles
 */
export function buildSearchIndex(): SearchableArticle[] {
  const articles: SearchableArticle[] = [];
  
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip hidden directories and templates
        if (!entry.name.startsWith('.') && entry.name !== 'templates') {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          // Read and parse the file
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          let frontmatter: any = {};
          let content = fileContent;
          
          try {
            const parsed = matter(fileContent);
            frontmatter = parsed.data;
            content = parsed.content;
          } catch (parseError) {
            // If frontmatter parsing fails, just use the raw content
            console.warn(`Failed to parse frontmatter for ${fullPath}:`, parseError);
          }
          
          // Get relative path from vault root
          const relativePath = path.relative(VAULT_PATH, fullPath);
          const fileName = entry.name.replace(/\.md$/, '');
          
          // Create slug array from path
          const slug = relativePath.replace(/\.md$/, '').split(path.sep);
          
          // Get category (folder name)
          const category = slug.length > 1 ? slug[0] : 'General';
          
          // Generate title from filename if not in frontmatter
          const title = frontmatter.title || fileName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          
          // Get tags from frontmatter
          const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                      typeof frontmatter.tags === 'string' ? [frontmatter.tags] : [];
          
          // Create excerpt (first 200 chars of content, no markdown)
          const plainContent = content
            .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
            .replace(/[#*`[\]()]/g, '') // Remove markdown formatting
            .trim();
          const excerpt = plainContent.substring(0, 200).trim() + 
                         (plainContent.length > 200 ? '...' : '');
          
          articles.push({
            title,
            slug,
            category: category.charAt(0).toUpperCase() + category.slice(1),
            content: plainContent,
            excerpt,
            tags,
            filePath: fullPath,
          });
        } catch (error) {
          console.error(`Error processing ${fullPath}:`, error);
        }
      }
    }
  }
  
  scanDirectory(VAULT_PATH);
  return articles;
}

/**
 * Get a lightweight version of the search index for client-side use
 * (without full content to reduce bundle size)
 */
export function buildClientSearchIndex(): Omit<SearchableArticle, 'content' | 'filePath'>[] {
  const fullIndex = buildSearchIndex();
  
  return fullIndex.map(({ title, slug, category, excerpt, tags }) => ({
    title,
    slug,
    category,
    excerpt,
    tags,
  }));
}
