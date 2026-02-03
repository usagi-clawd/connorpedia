import React from 'react';

interface InfoBoxProps {
  data: { [key: string]: any };
  title: string;
}

// Type-specific field configurations
const FIELD_CONFIGS: { [key: string]: { label: string; fields: string[] } } = {
  person: {
    label: 'Person',
    fields: ['image', 'born', 'location', 'occupation', 'partner', 'email', 'website', 'status']
  },
  idea: {
    label: 'Idea',
    fields: ['image', 'type', 'status', 'source', 'origin', 'related']
  },
  project: {
    label: 'Project',
    fields: ['image', 'status', 'started', 'tech', 'stack', 'links', 'github', 'url']
  },
  place: {
    label: 'Place',
    fields: ['image', 'location', 'coordinates', 'significance', 'type', 'visited']
  }
};

// Field label mapping for prettier display
const FIELD_LABELS: { [key: string]: string } = {
  born: 'Born',
  location: 'Location',
  occupation: 'Occupation',
  partner: 'Partner',
  email: 'Email',
  website: 'Website',
  status: 'Status',
  type: 'Type',
  source: 'Source',
  origin: 'Origin',
  related: 'Related',
  started: 'Started',
  tech: 'Tech',
  stack: 'Stack',
  links: 'Links',
  github: 'GitHub',
  url: 'URL',
  coordinates: 'Coordinates',
  significance: 'Significance',
  visited: 'Visited'
};

export default function InfoBox({ data, title }: InfoBoxProps) {
  // Determine the content type from frontmatter
  const contentType = data.type?.toLowerCase() || 'person';
  const config = FIELD_CONFIGS[contentType] || FIELD_CONFIGS.person;
  
  // Get image if present
  const image = data.image;
  
  // Process wiki-links in text (e.g., [[nhu-hoang]] -> link)
  const processWikiLinks = (text: string): React.ReactNode => {
    if (typeof text !== 'string') return text;
    
    // Match [[text]] or [[link|display]]
    const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = wikiLinkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const link = match[1];
      const display = match[2] || link;
      const href = `/wiki/${link}`;
      
      parts.push(
        <a key={match.index} href={href} className="infobox-wikilink">
          {display}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  // Format field values
  const formatValue = (value: any): React.ReactNode => {
    if (value === undefined || value === null || value === '') return null;
    
    if (Array.isArray(value)) {
      return value.map((v, i) => (
        <React.Fragment key={i}>
          {processWikiLinks(String(v))}
          {i < value.length - 1 && ', '}
        </React.Fragment>
      ));
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return processWikiLinks(String(value));
  };
  
  // Get fields to display based on content type
  const fieldsToDisplay = config.fields
    .filter(field => field !== 'image') // Handle image separately
    .map(field => ({
      key: field,
      label: FIELD_LABELS[field] || field.charAt(0).toUpperCase() + field.slice(1),
      value: data[field]
    }))
    .filter(({ value }) => value !== undefined && value !== null && value !== '');
  
  // Don't render if no meaningful data
  if (fieldsToDisplay.length === 0 && !image) {
    return null;
  }
  
  return (
    <div className="infobox">
      {/* Image section */}
      {image && (
        <div className="infobox-image">
          <img src={image} alt={title} />
        </div>
      )}
      
      {/* Header with title */}
      <div className="infobox-header">
        {title}
      </div>
      
      {/* Data rows */}
      {fieldsToDisplay.length > 0 && (
        <table className="infobox-table">
          <tbody>
            {fieldsToDisplay.map(({ key, label, value }) => (
              <tr key={key}>
                <th>{label}</th>
                <td>{formatValue(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
