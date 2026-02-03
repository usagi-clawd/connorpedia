import { visit } from 'unist-util-visit';
import type { Root, Text, Link, Parent } from 'mdast';
import { resolveWikiLink } from './vault-index';

/**
 * Remark plugin to transform wiki-style links [[link]] into proper markdown links
 * Supports:
 * - [[page-name]] - simple links
 * - [[page-name|Display Text]] - aliased links
 */
export function remarkWikiLink() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== 'number') return;
      
      const text = node.value;
      const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      
      let match;
      let lastIndex = 0;
      const newNodes: Array<Text | Link> = [];
      
      while ((match = wikiLinkRegex.exec(text)) !== null) {
        const fullMatch = match[0];
        const linkTarget = match[1].trim();
        const displayText = match[2]?.trim() || linkTarget;
        
        // Add text before the wiki link
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.substring(lastIndex, match.index),
          });
        }
        
        // Resolve the wiki link
        const pageInfo = resolveWikiLink(linkTarget);
        
        if (pageInfo) {
          // Page exists - create a normal link
          const url = `/wiki/${pageInfo.slug.join('/')}`;
          newNodes.push({
            type: 'link',
            url,
            title: null,
            children: [{ type: 'text', value: displayText }],
            data: {
              hProperties: {
                className: ['wiki-link'],
              },
            },
          } as Link);
        } else {
          // Page doesn't exist - create a red link
          const slugifiedTarget = linkTarget.toLowerCase().replace(/\s+/g, '-');
          const url = `/wiki/${slugifiedTarget}`;
          newNodes.push({
            type: 'link',
            url,
            title: null,
            children: [{ type: 'text', value: displayText }],
            data: {
              hProperties: {
                className: ['wiki-link', 'wiki-link-missing'],
              },
            },
          } as Link);
        }
        
        lastIndex = match.index + fullMatch.length;
      }
      
      // If we found any wiki links, replace the node
      if (newNodes.length > 0) {
        // Add remaining text after last match
        if (lastIndex < text.length) {
          newNodes.push({
            type: 'text',
            value: text.substring(lastIndex),
          });
        }
        
        // Replace the text node with our new nodes
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
