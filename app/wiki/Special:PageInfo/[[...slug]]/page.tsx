import { getPageInfo } from '@/lib/markdown';
import WikiSidebar from '@/app/components/WikiSidebar';
import ArticleHeader from '@/app/components/ArticleHeader';
import { TocProvider } from '@/app/contexts/TocContext';
import Link from 'next/link';

interface PageInfoProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function PageInfo({ params }: PageInfoProps) {
  const { slug: slugParam } = await params;
  
  if (!slugParam || slugParam.length === 0) {
    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar />
          <main className="mw-content-wrapper">
            <div className="mw-body">
              <div className="mw-body-content">
                <ArticleHeader title="Page Information" />
                <div className="mw-parser-output">
                  <p>Please specify a page to view information for.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </TocProvider>
    );
  }

  const slug = slugParam;
  const pageInfo = await getPageInfo(slug);
  
  if (!pageInfo) {
    return (
      <TocProvider>
        <div className="mw-content-container">
          <WikiSidebar />
          <main className="mw-content-wrapper">
            <div className="mw-body">
              <div className="mw-body-content">
                <ArticleHeader title="Page Information" />
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

  const { article, wordCount, characterCount, headingCount, linkCount, fileSize, lastModified } = pageInfo;
  const targetPath = `/wiki/${slug.join('/')}`;

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  };

  return (
    <TocProvider>
      <div className="mw-content-container">
        <WikiSidebar currentSlug={slug} />
        <main className="mw-content-wrapper">
          <div className="mw-body">
            <div className="mw-body-content">
              <ArticleHeader title="Page Information" />
              
              <div className="mw-parser-output">
                <p className="mw-special-intro">
                  Information about{' '}
                  <Link href={targetPath} className="mw-redirect">
                    {article.title}
                  </Link>
                </p>

                <h2>Basic Information</h2>
                <table className="wikitable">
                  <tbody>
                    <tr>
                      <th>Page title</th>
                      <td>{article.title}</td>
                    </tr>
                    <tr>
                      <th>Page path</th>
                      <td><code>{slug.join('/')}</code></td>
                    </tr>
                    {article.frontMatter.type && (
                      <tr>
                        <th>Page type</th>
                        <td>{article.frontMatter.type}</td>
                      </tr>
                    )}
                    {article.frontMatter.date && (
                      <tr>
                        <th>Created date</th>
                        <td>{new Date(article.frontMatter.date).toLocaleDateString()}</td>
                      </tr>
                    )}
                    <tr>
                      <th>Last modified</th>
                      <td>{formatDate(lastModified)}</td>
                    </tr>
                  </tbody>
                </table>

                {Object.keys(article.frontMatter).length > 0 && (
                  <>
                    <h2>Frontmatter</h2>
                    <table className="wikitable">
                      <tbody>
                        {Object.entries(article.frontMatter).map(([key, value]) => (
                          <tr key={key}>
                            <th>{key}</th>
                            <td>
                              {Array.isArray(value) ? (
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                  {value.map((item, i) => (
                                    <li key={i}>{String(item)}</li>
                                  ))}
                                </ul>
                              ) : typeof value === 'object' && value !== null ? (
                                <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
                              ) : (
                                String(value)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                <h2>Page Statistics</h2>
                <table className="wikitable">
                  <tbody>
                    <tr>
                      <th>Word count</th>
                      <td>{wordCount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th>Character count</th>
                      <td>{characterCount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th>Heading count</th>
                      <td>{headingCount}</td>
                    </tr>
                    <tr>
                      <th>Wiki link count</th>
                      <td>{linkCount}</td>
                    </tr>
                    <tr>
                      <th>File size</th>
                      <td>{formatFileSize(fileSize)}</td>
                    </tr>
                  </tbody>
                </table>

                {article.toc.length > 0 && (
                  <>
                    <h2>Table of Contents</h2>
                    <ul className="mw-special-list">
                      {article.toc.map((item, index) => (
                        <li key={index} style={{ marginLeft: `${(item.level - 1) * 20}px` }}>
                          {item.text} (Level {item.level})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </TocProvider>
  );
}

export async function generateMetadata({ params }: PageInfoProps) {
  const { slug: slugParam } = await params;
  const slug = slugParam || [];
  const pageInfo = await getPageInfo(slug);
  
  const title = pageInfo 
    ? `Information for ${pageInfo.article.title} - Connorpedia`
    : 'Page Information - Connorpedia';
  
  return { title };
}
