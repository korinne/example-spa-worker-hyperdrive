import { use, Suspense, useState, useEffect } from "react";
import { cn, groupByGenre } from "./lib/utils";

// Breadcrumbs component
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

// Sidebar navigation component
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
              {counts && <span className="ml-2 text-xs text-text-primary">({genre.count})</span>}
            </a>
          ))}
        </div>
      </nav>
      
      <div className="mt-auto pt-6 px-6">
        <div className="text-xs text-text-primary">
          Powered by<br />
          <span className="text-accent-default">Cloudflare Hyperdrive</span>
        </div>
      </div>
    </aside>
  );
}

// Book card component
function BookCard({ book, onClick }) {
  return (
    <div 
      className="book-card cursor-pointer"
      onClick={onClick}
    >
      <div className="book-card-image">
        <img 
          src={book.image_url} 
          alt={book.title}
          className="w-full h-full object-contain transition-transform hover:scale-[1.03] duration-300" 
        />
      </div>
      <div className="book-card-content">
        <h3 className="text-lg font-noto-serif mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-text-primary text-sm mb-2">by {book.author}</p>
        <p className="text-text-primary text-sm overflow-hidden line-clamp-3 mb-4">{book.description}</p>
        <button className="btn-primary w-full text-sm font-bold">Learn more</button>
      </div>
    </div>
  );
}

// Book list component
function BooksList({ booksPromise, onSelectBook, filter }) {
  const books = use(booksPromise);
  
  // Process books to combine Science Fiction and Fantasy genres
  const processedBooks = books.map(book => {
    if (book.genre === "Science Fiction" || book.genre === "Fantasy") {
      return { ...book, genre: "Science Fiction & Fantasy" };
    }
    return book;
  });
  
  // Filter books if a genre is selected
  const filteredBooks = filter 
    ? (filter === "Science Fiction & Fantasy" 
        ? processedBooks.filter(book => 
            book.genre === "Science Fiction & Fantasy" || 
            book.genre === "Science Fiction" || 
            book.genre === "Fantasy")
        : processedBooks.filter(book => book.genre === filter))
    : processedBooks;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredBooks.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={() => onSelectBook(book.id)}
        />
      ))}
    </div>
  );
}

// Performance metrics component
function PerformanceMetrics({ performance }) {
  return (
    <section className="mb-12">
      <h3 className="mb-6">Performance Metrics</h3>
      
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-value">{performance.totalQueries}</div>
          <div className="metric-label">Database Queries</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {performance.totalDbTime ? Math.round(performance.totalDbTime) : 0}
            <span className="text-base ml-1 font-noto-sans text-text-muted">ms</span>
          </div>
          <div className="metric-label">Total DB Time</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">
            {performance.responseTime ? Math.round(performance.responseTime) : '-'}
            <span className="text-base ml-1 font-noto-sans text-text-muted">ms</span>
          </div>
          <div className="metric-label">API Response</div>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-text-primary mb-2">Hyperdrive Performance</h4>
        <p className="text-text-secondary">{performance.hyperdriveBenefit || "Using Cloudflare Hyperdrive to optimize multiple database round trips within a single API request."}</p>
      </div>
      
      {performance.queryDetails && performance.queryDetails.length > 0 && (
        <div>
          <h4 className="text-text-primary mb-4">Individual Query Performance</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {performance.queryDetails.map((query, index) => (
                <tr key={index}>
                  <td>{query.query}</td>
                  <td>{Math.round(query.time)} <span className="text-text-muted">ms</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// Book detail component
function BookDetail({ bookData, onBack, onSelectRelatedBook, onGenreClick, activeGenre }) {
  const { book, relatedBooks, recentRecommendations, genreStats, performance } = bookData;
  
  // Prepare breadcrumb items
  const breadcrumbItems = [
    { label: 'All Books', value: null },
  ];
  
  if (book.genre) {
    breadcrumbItems.push({ label: book.genre, value: book.genre });
  }
  
  breadcrumbItems.push({ label: book.title, value: 'book' });
  
  return (
    <div>
      {/* Breadcrumbs at the very top */}
      <Breadcrumbs 
        items={breadcrumbItems} 
        onNavigate={(value) => {
          if (value === null) {
            // Navigate to all books
            onBack();
          } else if (value !== 'book') {
            // Navigate to genre
            onBack();
            onGenreClick(value);
          }
        }} 
      />
      
      <div className="space-y-12 mt-6">
        <div className="card">
          <div className="md:flex gap-10">
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-8 md:mb-0">
              <img 
                src={book.image_url} 
                alt={book.title}
                className="w-full h-full object-contain rounded-md border border-border-light" 
              />
            </div>
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="mb-3">{book.title}</h1>
              <h2 className="text-xl text-text-primary mb-6 font-noto-serif font-normal">by {book.author}</h2>
              
              {book.genre && (
                <div className="mb-6">
                  <span className="inline-block border border-accent-default text-accent-default text-sm px-3 py-1 rounded-full font-noto-sans">
                    {book.genre}
                  </span>
                </div>
              )}
              
              <p className="text-text-primary leading-relaxed">{book.description}</p>
            </div>
          </div>
        </div>
        
        {/* Performance metrics section */}
        <PerformanceMetrics performance={performance} />
        
        {/* Other books in this genre - combined section */}
        {relatedBooks.length > 0 && (
          <section className="mb-12">
            <h3 className="mb-6">
              {book.genre ? `Other Books in ${book.genre}` : 'You May Also Like'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedBooks.map((relBook) => (
                <div 
                  key={relBook.id} 
                  className="card py-4 px-5 text-center cursor-pointer" 
                  onClick={() => onSelectRelatedBook(relBook.id)}
                >
                  <div className="w-24 h-32 mx-auto mb-3">
                    <img 
                      src={relBook.image_url} 
                      alt={relBook.title}
                      className="w-full h-full object-contain rounded-sm border border-border-light" 
                    />
                  </div>
                  <div className="font-noto-serif text-text-primary mb-1 line-clamp-1">{relBook.title}</div>
                  <div className="text-text-primary text-sm font-noto-sans">{relBook.author}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Main App component
function App() {
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  
  // Main books list promise
  const booksPromise = fetch("/api/data").then(response => {
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    return response.json();
  });
  
  // Calculate genres when books are loaded and combine Science Fiction & Fantasy
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const books = await booksPromise;
        
        // Modify books to combine Science Fiction and Fantasy genres
        const modifiedBooks = books.map(book => {
          if (book.genre === "Science Fiction" || book.genre === "Fantasy") {
            return { ...book, genre: "Science Fiction & Fantasy" };
          }
          return book;
        });
        
        const genreGroups = groupByGenre(modifiedBooks);
        setGenres(genreGroups);
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    
    loadGenres();
  }, []);
  
  // Load book details when a book is selected
  useEffect(() => {
    if (!selectedBookId) return;
    
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const startTime = performance.now();
        const response = await fetch(`/api/books/${selectedBookId}`);
        const endTime = performance.now();
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Combine Science Fiction and Fantasy genres
        if (data.book.genre === "Science Fiction" || data.book.genre === "Fantasy") {
          data.book.genre = "Science Fiction & Fantasy";
        }
        
        // Update related books genres as well
        if (data.relatedBooks && data.relatedBooks.length > 0) {
          data.relatedBooks = data.relatedBooks.map(book => {
            if (book.genre === "Science Fiction" || book.genre === "Fantasy") {
              return { ...book, genre: "Science Fiction & Fantasy" };
            }
            return book;
          });
        }
        
        // Add response time to the performance metrics
        data.performance.responseTime = Math.round(endTime - startTime);
        setBookDetail(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetail();
  }, [selectedBookId]);
  
  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
  };
  
  const handleBackToLibrary = () => {
    setSelectedBookId(null);
    setBookDetail(null);
  };
  
  const handleSelectGenre = (genre) => {
    setActiveGenre(genre);
  };

  return (
    <div className="layout">
      <Sidebar 
        genres={genres} 
        activeGenre={activeGenre} 
        onSelectGenre={handleSelectGenre}
        counts
      />
      
      <main className="main-content">
        {/* Breadcrumbs for main library page */}
        {!selectedBookId && (
          <Breadcrumbs 
            items={[
              { label: 'All Books', value: null },
              ...(activeGenre ? [{ label: activeGenre, value: activeGenre }] : [])
            ]} 
            onNavigate={(value) => {
              if (value === null) {
                handleSelectGenre(null);
              }
            }} 
          />
        )}
        
        <div className="page-header">
          <h1>
            {activeGenre ? `${activeGenre} Books` : 'My Library'}
          </h1>
          <p className="text-text-primary">
            {activeGenre 
              ? `Explore our collection of ${activeGenre.toLowerCase()} books` 
              : 'Discover your next favorite book'}
          </p>
        </div>

        {selectedBookId ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-accent-default border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookDetail ? (
            <BookDetail 
              bookData={bookDetail} 
              onBack={handleBackToLibrary} 
              onSelectRelatedBook={handleSelectBook}
              onGenreClick={handleSelectGenre}
              activeGenre={activeGenre}
            />
          ) : (
            <div className="text-center py-20 text-text-secondary">Error loading book details</div>
          )
        ) : (
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-accent-default border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <BooksList 
              booksPromise={booksPromise} 
              onSelectBook={handleSelectBook}
              filter={activeGenre}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;