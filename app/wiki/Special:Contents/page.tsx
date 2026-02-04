import { getCategoryArticles } from '@/lib/markdown';
import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import WikiFooter from '@/app/components/WikiFooter';
import { TocProvider } from '@/app/contexts/TocContext';
import Link from 'next/link';

// Define the main content categories
const CATEGORIES = [
  { id: 'people', name: 'People', description: 'Notable individuals, historical figures, and personalities' },
  { id: 'ideas', name: 'Ideas', description: 'Concepts, theories, philosophies, and intellectual frameworks' },
  { id: 'projects', name: 'Projects', description: 'Initiatives, endeavors, and collaborative works' },
  { id: 'places', name: 'Places', description: 'Locations, venues, and geographic entities' },
  { id: 'things', name: 'Things', description: 'Objects, artifacts, and tangible items of interest' },
  { id: 'events', name: 'Events', description: 'Occurrences, happenings, and significant moments' },
];

export default async function ContentsPage() {
  // Fetch articles for each category
  const categoryData = await Promise.all(
    CATEGORIES.map(async (category) => {
      const articles = await getCategoryArticles(category.id);
      return {
        ...category,
        articles: articles.sort((a, b) => a.title.localeCompare(b.title)),
        count: articles.length,
      };
    })
  );

  // Calculate total article count
  const totalArticles = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <TocProvider>
      <div className="mw-content-container">
        <WikiSidebar />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title="Contents" />
              
              <div className="mw-parser-output">
                <div className="contents-intro">
                  <p>
                    Welcome to the <strong>Connorpedia</strong> contents page. This page provides
                    a navigable overview of all {totalArticles} articles in the vault, organized
                    by category.
                  </p>
                </div>

                {categoryData.map((category) => (
                  <section key={category.id} className="contents-category">
                    <h2>
                      <Link href={`/wiki/${category.id}`}>
                        {category.name}
                      </Link>
                      <span className="contents-count" title={`${category.count} articles`}>
                        ({category.count})
                      </span>
                    </h2>
                    
                    <p className="contents-category-description">
                      {category.description}
                    </p>

                    {category.count === 0 ? (
                      <p className="contents-empty">
                        <em>No articles in this category yet.</em>
                      </p>
                    ) : (
                      <ul className="contents-article-list">
                        {category.articles.map((article) => {
                          const articlePath = `/wiki/${article.slug.join('/')}`;
                          return (
                            <li key={article.slug.join('/')}>
                              <Link href={articlePath}>
                                {article.title}
                              </Link>
                              {article.description && (
                                <span className="contents-article-description">
                                  {' — '}{article.description}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                ))}

                <div className="contents-footer">
                  <p>
                    <strong>See also:</strong>
                  </p>
                  <ul>
                    <li><Link href="/wiki/Special:Search">Search</Link> – Search all articles</li>
                    <li><Link href="/wiki">Main Page</Link> – Return to the main page</li>
                  </ul>
                </div>
              </div>

              <WikiFooter categories={['Portal']} />
            </div>
          </div>
        </main>
      </div>
    </TocProvider>
  );
}

export function generateMetadata() {
  return {
    title: 'Contents - Connorpedia',
    description: 'A navigable overview of all articles in the Connorpedia vault, organized by category',
  };
}
