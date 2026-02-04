import { getArticleBySlug, isCategory, getCategoryArticles } from '@/lib/markdown';
import InfoBox from '@/app/components/InfoBox';
import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import WikiFooter from '@/app/components/WikiFooter';
import CategoryIndex from '@/app/components/CategoryIndex';
import { TocProvider } from '@/app/contexts/TocContext';

interface WikiPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug: slugParam } = await params;
  const slug = slugParam || ['test'];
  
  // Check if this is a category (directory) request
  if (isCategory(slug)) {
    const category = slug.join('/');
    const articles = await getCategoryArticles(category);
    
    const categoryTitle = slug[slug.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar currentSlug={slug} />
          <main className="mw-content-wrapper">
            <div className="mw-body">
              <div className="mw-body-content">
                <ArticleHeader title={`Category: ${categoryTitle}`} />
                <CategoryIndex category={category} articles={articles} />
              </div>
            </div>
          </main>
        </div>
      </TocProvider>
    );
  }
  
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar currentSlug={slug} />
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
      </TocProvider>
    );
  }

  // Extract categories from frontmatter tags
  const categories = article.frontMatter.tags || article.frontMatter.categories || [];

  return (
    <TocProvider toc={article.toc} tocHtml={article.tocHtml}>
      <div className="mw-content-container">
        <WikiSidebar currentSlug={slug} />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title={article.title} />
              
              {/* InfoBox - Wikipedia-style infobox */}
              {Object.keys(article.frontMatter).length > 0 && (
                <InfoBox data={article.frontMatter} title={article.title} />
              )}
              
              {/* TOC removed - now in sidebar */}
              
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
    </TocProvider>
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
