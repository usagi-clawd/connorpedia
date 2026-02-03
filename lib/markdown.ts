import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const VAULT_PATH = '/home/usagi/clawd/vault';

export interface Article {
  slug: string[];
  title: string;
  content: string;
  frontMatter: { [key: string]: any };
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

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);
    
    const contentHtml = processedContent.toString();

    // Extract title from frontmatter or use slug
    const title = data.title || slug[slug.length - 1].replace(/-/g, ' ');

    return {
      slug,
      title,
      content: contentHtml,
      frontMatter: data,
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
