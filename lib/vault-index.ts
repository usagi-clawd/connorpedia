import fs from 'fs';
import path from 'path';

const VAULT_PATH = '/home/usagi/clawd/vault';

export interface PageInfo {
  title: string;
  filePath: string;
  slug: string[];
}

let pageIndex: Map<string, PageInfo> | null = null;

/**
 * Build an index of all pages in the vault
 * Maps page names (lowercase, normalized) to their file paths
 */
export function buildPageIndex(): Map<string, PageInfo> {
  if (pageIndex) {
    return pageIndex;
  }

  pageIndex = new Map();
  
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
        // Get relative path from vault root
        const relativePath = path.relative(VAULT_PATH, fullPath);
        const fileName = entry.name.replace(/\.md$/, '');
        
        // Create slug array from path (e.g., ['people', 'connor-daly'])
        const slug = relativePath.replace(/\.md$/, '').split(path.sep);
        
        // Multiple keys for lookup:
        // 1. Just the filename (e.g., "connor-daly")
        const fileNameKey = fileName.toLowerCase();
        
        // 2. Full path (e.g., "people/connor-daly")
        const fullPathKey = slug.join('/').toLowerCase();
        
        const pageInfo: PageInfo = {
          title: fileName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          filePath: fullPath,
          slug,
        };
        
        // Add both keys - full path takes precedence
        if (!pageIndex!.has(fileNameKey)) {
          pageIndex!.set(fileNameKey, pageInfo);
        }
        pageIndex!.set(fullPathKey, pageInfo);
      }
    }
  }
  
  scanDirectory(VAULT_PATH);
  return pageIndex;
}

/**
 * Resolve a wiki link to a page slug
 * Returns null if page doesn't exist
 */
export function resolveWikiLink(linkText: string): PageInfo | null {
  const index = buildPageIndex();
  const normalizedLink = linkText.toLowerCase().trim();
  
  // Try exact match first
  if (index.has(normalizedLink)) {
    return index.get(normalizedLink)!;
  }
  
  // Try with hyphens instead of spaces
  const hyphenated = normalizedLink.replace(/\s+/g, '-');
  if (index.has(hyphenated)) {
    return index.get(hyphenated)!;
  }
  
  return null;
}

/**
 * Get all pages in the vault
 */
export function getAllPages(): PageInfo[] {
  const index = buildPageIndex();
  const seen = new Set<string>();
  const pages: PageInfo[] = [];
  
  for (const [key, info] of index.entries()) {
    const uniqueKey = info.slug.join('/');
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      pages.push(info);
    }
  }
  
  return pages;
}
