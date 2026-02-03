import { getArticleBySlug } from '@/lib/markdown';
import FrontMatter from '@/app/components/FrontMatter';
import TableOfContents from '@/app/components/TableOfContents';

interface WikiPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug: slugParam } = await params;
  const slug = slugParam || ['test'];
  
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="mw-content-container">
        <aside className="mw-sidebar">
          <nav>
            <h3>Navigation</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="/">Main Page</a></li>
            </ul>
          </nav>
        </aside>
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <h1 className="firstHeading">Page Not Found</h1>
              <div className="mw-parser-output">
                <p>
                  The page <strong>{slug.join('/')}</strong> does not exist.
                </p>
                <p>
                  You can <a href="/">return to the main page</a> or use the navigation to find what you're looking for.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mw-content-container">
      <aside className="mw-sidebar">
        <nav>
          <h3>Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/">Main Page</a></li>
          </ul>
        </nav>
      </aside>
      <main className="mw-content-wrapper">
        <div className="mw-body">
          <div className="mw-body-content">
            <h1 className="firstHeading">{article.title}</h1>
            
            {/* Frontmatter metadata box */}
            {Object.keys(article.frontMatter).length > 0 && (
              <FrontMatter data={article.frontMatter} />
            )}
            
            {/* Table of Contents */}
            {article.toc.length > 0 && (
              <TableOfContents html={article.tocHtml} />
            )}
            
            {/* Article content */}
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
  const { slug: slugParam } = await params;
  const slug = slugParam || ['test'];
  const article = await getArticleBySlug(slug);
  
  return {
    title: article ? `${article.title} - Connorpedia` : 'Article Not Found - Connorpedia',
  };
}
