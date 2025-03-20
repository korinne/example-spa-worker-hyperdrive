
function Breadcrumbs({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="breadcrumb-item">
            {isLast ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <>
                <span 
                  className="breadcrumb-link"
                  onClick={() => onNavigate(item.value)}
                >
                  {item.label}
                </span>
                <span className="breadcrumb-separator">&gt;</span>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;