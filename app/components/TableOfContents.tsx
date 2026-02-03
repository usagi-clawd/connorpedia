'use client';

import { useState } from 'react';

interface TableOfContentsProps {
  html: string;
}

export default function TableOfContents({ html }: TableOfContentsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`toc-container ${collapsed ? 'collapsed' : ''}`}>
      <div 
        className="toc-title" 
        onClick={() => setCollapsed(!collapsed)}
      >
        Contents
      </div>
      <div 
        className="toc-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
