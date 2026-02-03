import Link from 'next/link';

interface PortalBoxProps {
  title: string;
  href: string;
  description: string;
  count: number;
  icon?: string;
}

export default function PortalBox({ title, href, description, count, icon }: PortalBoxProps) {
  return (
    <div className="portal-box">
      <div className="portal-header">
        <h3>
          {icon && <span className="portal-icon">{icon}</span>}
          <Link href={href}>{title}</Link>
        </h3>
      </div>
      <div className="portal-body">
        <p>{description}</p>
        <p className="portal-count">{count} {count === 1 ? 'article' : 'articles'}</p>
      </div>
    </div>
  );
}
