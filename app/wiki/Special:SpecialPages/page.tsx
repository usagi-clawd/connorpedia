import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import { TocProvider } from '@/app/contexts/TocContext';
import Link from 'next/link';

export default function SpecialPages() {
  const specialPages = [
    {
      name: 'Search',
      path: '/wiki/Special:Search',
      description: 'Search for pages in Connorpedia',
    },
    {
      name: 'What Links Here',
      path: '/wiki/Special:WhatLinksHere',
      description: 'Find all pages that link to a specific article',
    },
    {
      name: 'Page Information',
      path: '/wiki/Special:PageInfo',
      description: 'View detailed metadata and statistics for a page',
    },
    {
      name: 'Special Pages',
      path: '/wiki/Special:SpecialPages',
      description: 'This page - a list of all special pages',
    },
  ];

  const navigationPages = [
    {
      name: 'Main Page',
      path: '/',
      description: 'The main page of Connorpedia',
    },
    {
      name: 'Contents',
      path: '/wiki/contents',
      description: 'Browse all content by category',
    },
    {
      name: 'Current Events',
      path: '/wiki/current-events',
      description: 'What\'s happening now',
    },
    {
      name: 'Random Article',
      path: '/wiki/random',
      description: 'Display a random article',
    },
    {
      name: 'About',
      path: '/wiki/about',
      description: 'Learn more about Connorpedia',
    },
  ];

  return (
    <TocProvider>
      <div className="mw-content-container">
        <WikiSidebar />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title="Special Pages" />
              
              <div className="mw-parser-output">
                <p className="mw-special-intro">
                  This page lists special pages in Connorpedia. Special pages are pages 
                  that provide functionality beyond standard articles, such as search, 
                  backlink tracking, and metadata display.
                </p>

                <h2>Tools</h2>
                <ul className="mw-special-list">
                  {specialPages.map((page) => (
                    <li key={page.path} className="mw-special-list-item">
                      <Link href={page.path} className="mw-special-link">
                        {page.name}
                      </Link>
                      <div className="mw-special-description">
                        {page.description}
                      </div>
                    </li>
                  ))}
                </ul>

                <h2>Navigation</h2>
                <ul className="mw-special-list">
                  {navigationPages.map((page) => (
                    <li key={page.path} className="mw-special-list-item">
                      <Link href={page.path} className="mw-special-link">
                        {page.name}
                      </Link>
                      <div className="mw-special-description">
                        {page.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TocProvider>
  );
}

export const metadata = {
  title: 'Special Pages - Connorpedia',
  description: 'List of all special pages and tools in Connorpedia',
};
