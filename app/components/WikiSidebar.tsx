'use client';

import { useState } from 'react';

export default function WikiSidebar() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  return (
    <aside className="mw-sidebar">
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
            <li><a href="#" onClick={(e) => e.preventDefault()}>What links here</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Related changes</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Special pages</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Permanent link</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Page information</a></li>
          </ul>
        )}
      </nav>
    </aside>
  );
}
