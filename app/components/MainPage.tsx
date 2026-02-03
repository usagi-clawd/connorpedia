import Link from 'next/link';
import PortalBox from './PortalBox';
import { getVaultStats, getRecentChanges } from '@/lib/stats';

// Hardcoded "Did you know" facts - can be made dynamic later
const didYouKnowFacts = [
  {
    text: 'Connor Daly turned a chance encounter in Korea into his entire life philosophy about friendship?',
    link: '/wiki/ideas/korea-cult-story',
  },
  {
    text: 'The Friendship Pipeline has specific stages: Spark → Kindle → Sustain?',
    link: '/wiki/ideas/the-friendship-pipeline',
  },
  {
    text: 'Connor hosts parties with a "chaotic good" alignment, balancing structure with spontaneity?',
    link: '/wiki/ideas/chaotic-good-party-formula',
  },
  {
    text: 'Connor maintains a personal "Friendship Atlas" to map and track his social network?',
    link: '/wiki/ideas/friendship-atlas',
  },
  {
    text: 'Connor believes in "co-conspirators" over "catch-up friends" for deep relationships?',
    link: '/wiki/ideas/co-conspirators-vs-catch-up-friends',
  },
];

export default async function MainPage() {
  const stats = getVaultStats();
  const recentChanges = getRecentChanges(5);
  
  // Randomly select 3 "did you know" facts
  const shuffledFacts = [...didYouKnowFacts].sort(() => Math.random() - 0.5).slice(0, 3);

  return (
    <div className="mw-content-container">
      <aside className="mw-sidebar">
        <nav>
          <h3>Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/">Main Page</a></li>
            <li><a href="/wiki/people">People</a></li>
            <li><a href="/wiki/ideas">Ideas</a></li>
            <li><a href="/wiki/projects">Projects</a></li>
            <li><a href="/wiki/places">Places</a></li>
            <li><a href="/wiki/things">Things</a></li>
          </ul>
        </nav>
      </aside>
      
      <main className="mw-content-wrapper">
        <div className="mw-body">
          <div className="mw-body-content">
            {/* Welcome Banner */}
            <div className="mainpage-welcome">
              <h1 className="firstHeading" style={{ fontSize: '2em', marginBottom: '0.5em' }}>
                Welcome to Connorpedia
              </h1>
              <p style={{ fontSize: '1.1em', marginBottom: '1.5em' }}>
                The personal encyclopedia of Connor Daly—a curated collection of ideas, 
                frameworks, people, projects, and stories that shape a life well-lived.
              </p>
            </div>

            {/* Two-column layout container */}
            <div className="mainpage-container">
              {/* Left Column */}
              <div className="mainpage-left">
                {/* Featured Article */}
                <div className="mainpage-box">
                  <h2 className="mp-h2" style={{ 
                    borderBottom: '1px solid #a2a9b1',
                    marginBottom: '0.5em',
                    paddingBottom: '0.3em',
                    fontSize: '1.4em'
                  }}>
                    <span style={{ color: '#0645ad' }}>Featured article</span>
                  </h2>
                  <div className="mp-box-content">
                    <p>
                      <strong><Link href="/wiki/people/connor-daly">Connor Daly</Link></strong> is 
                      a 32-year-old engineering leader, party host, and friendship architect based in Austin, Texas. 
                      Known for his systematic approach to community building and relationship cultivation, 
                      Connor has developed numerous frameworks including the <Link href="/wiki/ideas/the-friendship-pipeline">
                      Friendship Pipeline</Link>, <Link href="/wiki/ideas/chaotic-good-party-formula">Chaotic Good 
                      Party Formula</Link>, and <Link href="/wiki/ideas/connors-life-operating-system">Life Operating System</Link>.
                    </p>
                    <p>
                      From his roots in New Orleans to his current life in Austin, Connor's journey spans 
                      aerospace engineering, crypto startups, and healthcare AI. His philosophy centers on 
                      intentional community design, operational flourishing, and the belief that the quality 
                      of your life is largely determined by the quality of your relationships.
                    </p>
                    <p style={{ marginTop: '0.5em' }}>
                      <small><Link href="/wiki/people/connor-daly">Read more...</Link></small>
                    </p>
                  </div>
                </div>

                {/* Did You Know */}
                <div className="mainpage-box">
                  <h2 className="mp-h2" style={{ 
                    borderBottom: '1px solid #a2a9b1',
                    marginBottom: '0.5em',
                    paddingBottom: '0.3em',
                    fontSize: '1.4em'
                  }}>
                    <span style={{ color: '#0645ad' }}>Did you know...</span>
                  </h2>
                  <div className="mp-box-content">
                    <ul style={{ marginLeft: '1.5em' }}>
                      {shuffledFacts.map((fact, index) => (
                        <li key={index} style={{ marginBottom: '0.5em' }}>
                          ... that <Link href={fact.link}>{fact.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="mainpage-right">
                {/* Statistics */}
                <div className="mainpage-box">
                  <h2 className="mp-h2" style={{ 
                    borderBottom: '1px solid #a2a9b1',
                    marginBottom: '0.5em',
                    paddingBottom: '0.3em',
                    fontSize: '1.4em'
                  }}>
                    <span style={{ color: '#0645ad' }}>Statistics</span>
                  </h2>
                  <div className="mp-box-content">
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      <li><strong>{stats.totalArticles}</strong> total articles</li>
                      <li><strong>{stats.categoryCount.people}</strong> people profiles</li>
                      <li><strong>{stats.categoryCount.ideas}</strong> ideas & frameworks</li>
                      <li><strong>{stats.categoryCount.projects}</strong> projects documented</li>
                      <li><strong>{stats.categoryCount.places}</strong> places visited</li>
                      <li><strong>{stats.categoryCount.things}</strong> things collected</li>
                    </ul>
                  </div>
                </div>

                {/* Recent Changes */}
                <div className="mainpage-box">
                  <h2 className="mp-h2" style={{ 
                    borderBottom: '1px solid #a2a9b1',
                    marginBottom: '0.5em',
                    paddingBottom: '0.3em',
                    fontSize: '1.4em'
                  }}>
                    <span style={{ color: '#0645ad' }}>Recent changes</span>
                  </h2>
                  <div className="mp-box-content">
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {recentChanges.map((change, index) => (
                        <li key={index} style={{ marginBottom: '0.3em' }}>
                          <Link href={`/wiki/${change.slug.join('/')}`}>
                            {change.title}
                          </Link>
                          <small style={{ color: '#666', marginLeft: '0.5em' }}>
                            ({change.category})
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Portals - Full Width */}
            <div className="mainpage-box" style={{ marginTop: '1.5em' }}>
              <h2 className="mp-h2" style={{ 
                borderBottom: '1px solid #a2a9b1',
                marginBottom: '1em',
                paddingBottom: '0.3em',
                fontSize: '1.4em'
              }}>
                <span style={{ color: '#0645ad' }}>Browse by category</span>
              </h2>
              <div className="portal-grid">
                <PortalBox
                  title="People"
                  href="/wiki/people"
                  description="Friends, family, and influential figures in Connor's life"
                  count={stats.categoryCount.people}
                  icon="👥"
                />
                <PortalBox
                  title="Ideas"
                  href="/wiki/ideas"
                  description="Frameworks, philosophies, and mental models for living well"
                  count={stats.categoryCount.ideas}
                  icon="💡"
                />
                <PortalBox
                  title="Projects"
                  href="/wiki/projects"
                  description="Creative endeavors, builds, and experiments"
                  count={stats.categoryCount.projects}
                  icon="🛠️"
                />
                <PortalBox
                  title="Places"
                  href="/wiki/places"
                  description="Locations, venues, and spaces that matter"
                  count={stats.categoryCount.places}
                  icon="📍"
                />
                <PortalBox
                  title="Things"
                  href="/wiki/things"
                  description="Objects, tools, and possessions worth documenting"
                  count={stats.categoryCount.things}
                  icon="📦"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
