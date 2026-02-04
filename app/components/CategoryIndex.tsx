import { ArticleSummary } from '@/lib/markdown';

interface CategoryIndexProps {
  category: string;
  articles: ArticleSummary[];
}

export default function CategoryIndex({ category, articles }: CategoryIndexProps) {
  // Format category name for display
  const categoryTitle = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Group articles alphabetically
  const groupedArticles: { [key: string]: ArticleSummary[] } = {};
  
  articles.forEach(article => {
    const firstLetter = article.title.charAt(0).toUpperCase();
    if (!groupedArticles[firstLetter]) {
      groupedArticles[firstLetter] = [];
    }
    groupedArticles[firstLetter].push(article);
  });

  const sortedLetters = Object.keys(groupedArticles).sort();

  return (
    <div className="category-index">
      {/* Category description */}
      <div className="mw-parser-output">
        <p className="category-description">
          This category contains {articles.length} {articles.length === 1 ? 'page' : 'pages'}.
        </p>

        {/* Article list */}
        <div className="category-content">
          <h2>Pages in category "{categoryTitle}"</h2>
          
          {sortedLetters.map(letter => (
            <div key={letter} className="category-section">
              <h3 className="category-letter">{letter}</h3>
              <ul className="category-list">
                {groupedArticles[letter].map((article, index) => (
                  <li key={index} className="category-item">
                    <a href={`/wiki/${article.slug.join('/')}`} className="category-link">
                      {article.title}
                    </a>
                    {article.description && (
                      <span className="category-excerpt"> — {article.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Category footer */}
      <div className="article-footer">
        <div className="footer-links">
          <ul>
            <li><a href="/">Main Page</a></li>
            <li><a href="/wiki/categories">All Categories</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
