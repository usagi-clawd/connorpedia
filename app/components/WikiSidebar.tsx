'use client';

import { useState } from 'react';
import SidebarTableOfContents from './SidebarTableOfContents';

interface WikiSidebarProps {
  currentSlug?: string[];
}

export default function WikiSidebar({ currentSlug }: WikiSidebarProps) {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  // Generate tool links based on current page
  const slugPath = currentSlug ? currentSlug.join('/') : '';
  const whatLinksHereUrl = currentSlug ? `/wiki/Special:WhatLinksHere/${slugPath}` : '#';
  const pageInfoUrl = currentSlug ? `/wiki/Special:PageInfo/${slugPath}` : '#';

  const handlePermanentLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        // Could show a toast notification here
        alert('Link copied to clipboard!');
      });
    }
  };

  return (
    <aside className="mw-sidebar">
      {/* Table of Contents - Main feature at top */}
      <SidebarTableOfContents />

      {/* Separator */}
      <div className="sidebar-separator" />

      {/* Navigation Section */}
      <nav className="sidebar-section">
        <h3 
          className="sidebar-heading"
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          Navigation
        </h3>
        {navigationOpen && (
          <ul className="sidebar-list">
            <li><a href="/">Main Page</a></li>
            <li><a href="/wiki/contents">Contents</a></li>
            <li><a href="/wiki/current-events">Current events</a></li>
            <li><a href="/wiki/random">Random article</a></li>
            <li><a href="/wiki/about">About Connorpedia</a></li>
          </ul>
        )}
      </nav>

      {/* Tools Section */}
      <nav className="sidebar-section">
        <h3 
          className="sidebar-heading"
          onClick={() => setToolsOpen(!toolsOpen)}
        >
          Tools
        </h3>
        {toolsOpen && (
          <ul className="sidebar-list">
            <li><a href={whatLinksHereUrl}>What links here</a></li>
            <li><a href="/wiki/Special:SpecialPages">Special pages</a></li>
            <li><a href="#" onClick={handlePermanentLink}>Permanent link</a></li>
            <li><a href={pageInfoUrl}>Page information</a></li>
          </ul>
        )}
      </nav>
    </aside>
  );
}
