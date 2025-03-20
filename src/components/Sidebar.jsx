
function Sidebar({ genres, activeGenre, onSelectGenre, counts }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Athenaeum</div>
      
      <nav className="sidebar-nav">
        <a 
          href="#" 
          className={activeGenre === null ? "sidebar-link-active" : "sidebar-link"}
          onClick={() => onSelectGenre(null)}
        >
          All Books
        </a>
        
        <div className="sidebar-section">
          <div className="sidebar-heading">Genres</div>
          {genres.map(genre => (
            <a 
              key={genre.name}
              href="#" 
              className={activeGenre === genre.name ? "sidebar-link-active" : "sidebar-link"}
              onClick={() => onSelectGenre(genre.name)}
            >
              {genre.name}
              {counts && <span className="ml-2 text-xs text-gray-900">({genre.count})</span>}
            </a>
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