import { getArticleBySlug } from '@/lib/markdown';
import FrontMatter from '@/app/components/FrontMatter';
import TableOfContents from '@/app/components/TableOfContents';
import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import WikiFooter from '@/app/components/WikiFooter';

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
        <WikiSidebar />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title="Page Not Found" />
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

  // Extract categories from frontmatter tags
  const categories = article.frontMatter.tags || article.frontMatter.categories || [];

  return (
    <div className="mw-content-container">
      <WikiSidebar />
      <main className="mw-content-wrapper">
        <div className="mw-body">
          <div className="mw-body-content">
            <ArticleHeader title={article.title} />
            
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

            {/* Footer with categories and last edited info */}
            <WikiFooter 
              categories={Array.isArray(categories) ? categories : [categories].filter(Boolean)}
              lastModified={article.frontMatter.date || article.frontMatter.updated}
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
