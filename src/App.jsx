import { use, Suspense, useState, useEffect } from "react";
import { groupByGenre } from "./lib/utils";
import Breadcrumbs from "./components/Breadcrumbs";
import Sidebar from "./components/Sidebar";
import BookCard from "./components/BookCard";
import BooksList from "./components/BooksList";
import PerformanceMetrics from "./components/PerformanceMetrics";
import BookDetail from "./components/BookDetail";

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
          <p className="text-gray-900">
            {activeGenre 
              ? `Explore our collection of ${activeGenre.toLowerCase()} books` 
              : 'Discover your next favorite book'}
          </p>
        </div>

        {selectedBookId ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="text-center py-20 text-gray-600">Error loading book details</div>
          )
        ) : (
          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
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