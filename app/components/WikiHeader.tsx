'use client';

import { useState } from 'react';

export default function WikiHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/wiki/Special:Search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="mw-header">
      <div className="mw-header-container">
        {/* Logo */}
        <a href="/" className="mw-logo">
          <span className="mw-logo-icon">W</span>
          <span className="mw-logo-text">Connorpedia</span>
        </a>

        {/* Search */}
        <div className="mw-header-end">
          <form className="mw-search-form" onSubmit={handleSearch}>
            <input
              type="search"
              className="mw-search-input"
              placeholder="Search Connorpedia"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mw-search-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12.2 13.6a7 7 0 1 1 1.4-1.4l5.4 5.4-1.4 1.4-5.4-5.4zM3 8a5 5 0 1 0 10 0A5 5 0 0 0 3 8z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
