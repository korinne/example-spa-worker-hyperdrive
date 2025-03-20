import { Link } from 'react-router';

function Sidebar({ genres, activeGenre, counts }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Athenaeum</div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={activeGenre === null ? "sidebar-link-active" : "sidebar-link"}
        >
          All Books
        </Link>
        
        <div className="sidebar-section">
          <div className="sidebar-heading">Genres</div>
          {genres.map(genre => (
            <Link 
              key={genre.name}
              to={`/genre/${encodeURIComponent(genre.name)}`}
              className={activeGenre === genre.name ? "sidebar-link-active" : "sidebar-link"}
            >
              {genre.name}
              {counts && <span className="ml-2 text-xs text-gray-900">({genre.count})</span>}
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="mt-auto pt-6 px-6">
        <div className="text-xs text-gray-900">
          Powered by<br />
          <span className="text-blue-800">Cloudflare Hyperdrive</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;