interface FrontMatterProps {
  data: { [key: string]: any };
}

export default function FrontMatter({ data }: FrontMatterProps) {
  // Filter out empty or undefined values
  const entries = Object.entries(data).filter(([_, value]) => value !== undefined && value !== null);
  
  if (entries.length === 0) {
    return null;
  }

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="frontmatter-box">
      <div className="frontmatter-title">Page Information</div>
      <table className="frontmatter-table">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
              <td>{formatValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
