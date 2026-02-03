'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Fuse from 'fuse.js';
import WikiHeader from '@/app/components/WikiHeader';
import WikiFooter from '@/app/components/WikiFooter';

interface SearchResult {
  title: string;
  slug: string[];
  category: string;
  excerpt: string;
  tags: string[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch the search index
        const response = await fetch('/api/search-index');
        if (!response.ok) {
          throw new Error('Failed to load search index');
        }
        
        const searchIndex: SearchResult[] = await response.json();
        
        // Configure Fuse.js for fuzzy search
        const fuse = new Fuse(searchIndex, {
          keys: [
            { name: 'title', weight: 3 },      // Title is most important
            { name: 'tags', weight: 2 },       // Tags are important
            { name: 'category', weight: 1.5 }, // Category matters
            { name: 'excerpt', weight: 1 },    // Content is searched too
          ],
          threshold: 0.4, // 0 = perfect match, 1 = match anything
          ignoreLocation: true,
          includeScore: true,
        });
        
        // Perform the search
        const searchResults = fuse.search(query);
        
        // Extract the items from Fuse.js results
        const items = searchResults.map(result => result.item);
        
        setResults(items);
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  // Highlight query terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.split(' ').filter(Boolean).join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (regex.test(part)) {
        return <mark key={i} className="search-highlight">{part}</mark>;
      }
      return part;
    });
  };

  return (
    <div className="mw-page-container">
      <div className="mw-content-container">
        <main className="mw-body">
          <div className="mw-content">
            <h1 className="firstHeading">
              Search results {query && `for "${query}"`}
            </h1>
            
            <div className="mw-body-content">
              {loading ? (
                <p className="mw-empty-state">Searching...</p>
              ) : error ? (
                <p className="mw-empty-state" style={{ color: '#d33' }}>{error}</p>
              ) : !query.trim() ? (
                <p className="mw-empty-state">
                  Please enter a search query.
                </p>
              ) : results.length === 0 ? (
                <div className="mw-empty-state">
                  <p><strong>No results found for "{query}"</strong></p>
                  <p>Suggestions:</p>
                  <ul>
                    <li>Check your spelling</li>
                    <li>Try different keywords</li>
                    <li>Try more general keywords</li>
                    <li>Try fewer keywords</li>
                  </ul>
                </div>
              ) : (
                <>
                  <p className="search-results-info">
                    Showing {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="search-results">
                    {results.map((result, index) => {
                      const wikiPath = `/wiki/${result.slug.join('/')}`;
                      
                      return (
                        <div key={index} className="search-result">
                          <h3 className="search-result-title">
                            <Link href={wikiPath}>
                              {highlightText(result.title, query)}
                            </Link>
                          </h3>
                          
                          <div className="search-result-meta">
                            <span className="search-result-category">
                              {result.category}
                            </span>
                            {result.tags.length > 0 && (
                              <span className="search-result-tags">
                                {result.tags.map((tag, i) => (
                                  <span key={i} className="tag">#{tag}</span>
                                ))}
                              </span>
                            )}
                          </div>
                          
                          <p className="search-result-excerpt">
                            {highlightText(result.excerpt, query)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <WikiHeader />
      <Suspense fallback={
        <div className="mw-page-container">
          <div className="mw-content-container">
            <main className="mw-body">
              <div className="mw-content">
                <p className="mw-empty-state">Loading search...</p>
              </div>
            </main>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <WikiFooter />
    </>
  );
}
