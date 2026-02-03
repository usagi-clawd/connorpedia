export default function NotFound() {
  return (
    <div className="mw-content-container">
      <aside className="mw-sidebar">
        <nav>
          <h3>Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/">Main Page</a></li>
            <li><a href="/wiki/test">Test Article</a></li>
          </ul>
        </nav>
      </aside>
      <main className="mw-content-wrapper">
        <div className="mw-body">
          <div className="mw-body-content">
            <h1 className="firstHeading">Article Not Found</h1>
            <div className="mw-parser-output">
              <p>
                <strong>Connorpedia does not have an article with this exact name.</strong>
              </p>
              <p>
                The page you requested could not be found in the vault. This might be because:
              </p>
              <ul>
                <li>The article doesn't exist yet</li>
                <li>The article has been moved or renamed</li>
                <li>You followed a broken link</li>
              </ul>
              <p>
                You can return to the <a href="/">main page</a> or try the <a href="/wiki/test">test article</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
