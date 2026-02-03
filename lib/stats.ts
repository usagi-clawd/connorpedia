import fs from 'fs';
import path from 'path';
import { getAllPages } from './vault-index';

const VAULT_PATH = '/home/usagi/clawd/vault';

export interface VaultStats {
  totalArticles: number;
  categoryCount: {
    people: number;
    ideas: number;
    projects: number;
    places: number;
    things: number;
  };
}

export interface RecentChange {
  title: string;
  slug: string[];
  modifiedDate: Date;
  category: string;
}

/**
 * Get statistics about the vault
 */
export function getVaultStats(): VaultStats {
  const pages = getAllPages();
  
  const stats: VaultStats = {
    totalArticles: pages.length,
    categoryCount: {
      people: 0,
      ideas: 0,
      projects: 0,
      places: 0,
      things: 0,
    },
  };
  
  for (const page of pages) {
    const category = page.slug[0];
    if (category in stats.categoryCount) {
      stats.categoryCount[category as keyof typeof stats.categoryCount]++;
    }
  }
  
  return stats;
}

/**
 * Get recently modified articles
 */
export function getRecentChanges(limit: number = 5): RecentChange[] {
  const pages = getAllPages();
  const changes: RecentChange[] = [];
  
  for (const page of pages) {
    try {
      const stat = fs.statSync(page.filePath);
      changes.push({
        title: page.title,
        slug: page.slug,
        modifiedDate: stat.mtime,
        category: page.slug[0] || 'other',
      });
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  // Sort by modified date, most recent first
  changes.sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime());
  
  return changes.slice(0, limit);
}

/**
 * Get a random article from a category
 */
export function getRandomArticle(category?: string): { title: string; slug: string[] } | null {
  const pages = getAllPages();
  let filtered = pages;
  
  if (category) {
    filtered = pages.filter(p => p.slug[0] === category);
  }
  
  if (filtered.length === 0) {
    return null;
  }
  
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  return {
    title: random.title,
    slug: random.slug,
  };
}
