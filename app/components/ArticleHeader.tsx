'use client';

interface ArticleHeaderProps {
  title: string;
}

export default function ArticleHeader({ title }: ArticleHeaderProps) {
  return (
    <div className="article-header">
      {/* Page tabs */}
      <div className="article-tabs">
        <div className="article-tab active">
          <span>Article</span>
        </div>
        <div className="article-tab disabled">
          <span>Talk</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="article-actions">
        <div className="article-action active">
          <span>Read</span>
        </div>
        <div className="article-action disabled">
          <span>Edit</span>
        </div>
        <div className="article-action disabled">
          <span>View source</span>
        </div>
        <div className="article-action disabled">
          <span>View history</span>
        </div>
      </div>

      {/* Article title */}
      <h1 className="firstHeading">{title}</h1>
    </div>
  );
}
