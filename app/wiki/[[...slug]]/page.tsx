import { getArticleBySlug } from '@/lib/markdown';
import { notFound } from 'next/navigation';

interface WikiPageProps {
  params: {
    slug?: string[];
  };
}

export default async function WikiPage({ params }: WikiPageProps) {
  const slug = params.slug || ['test'];
  
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mw-content-container">
      <aside className="mw-sidebar">
        <nav>
          <h3>Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/">Main Page</a></li>
            <li><a href="/wiki/test">Test Article</a></li>
          </ul>
        </nav>
      </aside>
      <main className="mw-content-wrapper">
        <div className="mw-body">
          <div className="mw-body-content">
            <h1 className="firstHeading">{article.title}</h1>
            <div 
              className="mw-parser-output"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: WikiPageProps) {
  const slug = params.slug || ['test'];
  const article = await getArticleBySlug(slug);
  
  return {
    title: article ? `${article.title} - Connorpedia` : 'Article Not Found - Connorpedia',
  };
}
