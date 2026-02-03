import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root, Heading } from 'mdast';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

/**
 * Generate a table of contents from markdown content
 */
export async function generateToc(markdown: string): Promise<TocItem[]> {
  const tree = remark().parse(markdown);
  const headings: Array<{ level: number; text: string; id: string }> = [];
  
  visit(tree, 'heading', (node: Heading) => {
    // Extract text from heading
    let text = '';
    visit(node, 'text', (textNode) => {
      text += textNode.value;
    });
    
    // Generate an ID from the text
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    headings.push({
      level: node.depth,
      text,
      id,
    });
  });
  
  // Build hierarchical structure
  const toc: TocItem[] = [];
  const stack: Array<TocItem & { level: number }> = [];
  
  for (const heading of headings) {
    // Skip h1 as it's usually the page title
    if (heading.level === 1) continue;
    
    const item: TocItem = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
    };
    
    // Find the parent in the stack
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    if (stack.length === 0) {
      // Top-level item
      toc.push(item);
    } else {
      // Child item
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }
    
    stack.push(item);
  }
  
  return toc;
}

/**
 * Render TOC items to HTML
 */
export function renderToc(items: TocItem[]): string {
  if (items.length === 0) return '';
  
  let html = '<ul class="vector-toc-list">';
  
  for (const item of items) {
    html += `<li class="vector-toc-list-item">`;
    html += `<a href="#${item.id}">${item.text}</a>`;
    
    if (item.children && item.children.length > 0) {
      html += renderToc(item.children);
    }
    
    html += '</li>';
  }
  
  html += '</ul>';
  return html;
}
