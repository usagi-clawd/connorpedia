import { getBacklinks, getArticleBySlug } from '@/lib/markdown';
import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import { TocProvider } from '@/app/contexts/TocContext';
import Link from 'next/link';

interface WhatLinksHereProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function WhatLinksHere({ params }: WhatLinksHereProps) {
  const { slug: slugParam } = await params;
  
  if (!slugParam || slugParam.length === 0) {
    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar />
          <main className="mw-content-wrapper">
            <div className="mw-body">
              <div className="mw-body-content">
                <ArticleHeader title="What Links Here" />
                <div className="mw-parser-output">
                  <p>Please specify a page to find backlinks for.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </TocProvider>
    );
  }

  const slug = slugParam;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar />
          <main className="mw-content-wrapper">
            <div className="mw-body">
              <div className="mw-body-content">
                <ArticleHeader title="What Links Here" />
                <div className="mw-parser-output">
                  <p>The page <strong>{slug.join('/')}</strong> does not exist.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </TocProvider>
    );
  }

  const backlinks = await getBacklinks(slug);
  const targetPath = `/wiki/${slug.join('/')}`;

  return (
    <TocProvider>
      <div className="mw-content-container">
        <WikiSidebar currentSlug={slug} />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title="What Links Here" />
              
              <div className="mw-parser-output">
                <p className="mw-special-intro">
                  The following pages link to{' '}
                  <Link href={targetPath} className="mw-redirect">
                    {article.title}
                  </Link>:
                </p>

                {backlinks.length === 0 ? (
                  <p className="mw-empty-state">No pages link to this article.</p>
                ) : (
                  <ul className="mw-special-list">
                    {backlinks.map((backlink, index) => {
                      const backlinkPath = `/wiki/${backlink.slug.join('/')}`;
                      
                      return (
                        <li key={index} className="mw-special-list-item">
                          <Link href={backlinkPath}>
                            {backlink.title}
                          </Link>
                          {backlink.context && (
                            <div className="backlink-context">
                              {backlink.context}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </TocProvider>
  );
}

export async function generateMetadata({ params }: WhatLinksHereProps) {
  const { slug: slugParam } = await params;
  const slug = slugParam || [];
  const article = await getArticleBySlug(slug);
  
  const title = article 
    ? `What links to ${article.title} - Connorpedia`
    : 'What Links Here - Connorpedia';
  
  return { title };
}
