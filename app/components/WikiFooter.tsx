interface WikiFooterProps {
  categories?: string[];
  lastModified?: string;
}

export default function WikiFooter({ categories = [], lastModified }: WikiFooterProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="article-footer">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="footer-categories">
          <div className="footer-categories-label">Categories:</div>
          <ul className="footer-categories-list">
            {categories.map((category, index) => (
              <li key={index}>
                <a href={`/wiki/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Last edited */}
      <div className="footer-info">
        <p>This page was last edited on {formatDate(lastModified)}.</p>
      </div>

      {/* Footer links */}
      <div className="footer-links">
        <ul>
          <li><a href="/wiki/about">About Connorpedia</a></li>
          <li><a href="/wiki/disclaimers">Disclaimers</a></li>
          <li><a href="/wiki/privacy">Privacy policy</a></li>
        </ul>
      </div>
    </div>
  );
}
