export default function Home() {
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
            <h1 className="firstHeading">Welcome to Connorpedia</h1>
            <div className="mw-parser-output">
              <p>
                <strong>Connorpedia</strong> is a personal knowledge base rendered in authentic Wikipedia style.
              </p>
              <p>
                This is a custom renderer for Connor's Obsidian vault, designed to look and feel exactly like Wikipedia.
              </p>
              <h2>Features</h2>
              <ul>
                <li>Wikipedia Vector 2022 skin styling</li>
                <li>Markdown rendering from Obsidian vault</li>
                <li>Clean, familiar interface</li>
                <li>Fast Next.js performance</li>
              </ul>
              <h2>Getting Started</h2>
              <p>
                Browse articles using the navigation or try the <a href="/wiki/test">test article</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
