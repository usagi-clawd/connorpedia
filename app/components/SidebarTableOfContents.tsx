'use client';

import { useState, useEffect } from 'react';
import { useToc } from '@/app/contexts/TocContext';

export default function SidebarTableOfContents() {
  const { toc, tocHtml } = useToc();
  const [activeId, setActiveId] = useState<string>('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Track which section is currently visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
      }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [tocHtml]);

  // Add active class to the TOC HTML
  useEffect(() => {
    if (!activeId) return;

    // Remove all active classes
    const allLinks = document.querySelectorAll('.sidebar-toc-content a');
    allLinks.forEach((link) => link.classList.remove('active'));

    // Add active class to current section
    const activeLink = document.querySelector(`.sidebar-toc-content a[href="#${activeId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }, [activeId]);

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <nav className="sidebar-toc">
      <div 
        className="sidebar-toc-title"
        onClick={() => setCollapsed(!collapsed)}
      >
        Contents
      </div>
      {!collapsed && (
        <div 
          className="sidebar-toc-content"
          dangerouslySetInnerHTML={{ __html: tocHtml }}
        />
      )}
    </nav>
  );
}
