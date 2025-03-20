import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { groupByGenre } from "./lib/utils";
import Breadcrumbs from "./components/Breadcrumbs";
import Sidebar from "./components/Sidebar";
import BooksList from "./components/BooksList";
import BookDetail from "./components/BookDetail";

// Main App component
function App() {
  const navigate = useNavigate();
  const params = useParams();
  const [bookDetail, setBookDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  
  // Get route parameters
  const { bookId } = params;
  const { genreId } = params;
  const activeGenre = genreId ? decodeURIComponent(genreId) : null;
  
  // Main books list promise
  const booksPromise = useMemo(() => 
    fetch("/api/data").then(response => {
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      return response.json();
    }),
  []);
  
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
  }, [booksPromise]);
  
  // Load book details when a book is selected via URL
  useEffect(() => {
    if (!bookId) return;
    
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const startTime = performance.now();
        const response = await fetch(`/api/books/${bookId}`);
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
  }, [bookId]);
  
  const handleSelectBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  
  const handleSelectGenre = (genre) => {
    if (genre) {
      navigate(`/genre/${encodeURIComponent(genre)}`);
    } else {
      navigate('/');
    }
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
        {!bookId && (
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

        {bookId ? (
          loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookDetail ? (
            <BookDetail 
              bookData={bookDetail} 
            />
          ) : (
            <div className="text-center py-20 text-gray-600">Error loading book details</div>
          )
        ) : (
          <BooksList 
            booksPromise={booksPromise} 
            onSelectBook={handleSelectBook}
            filter={activeGenre}
          />
        )}
      </main>
    </div>
  );
}

export default App;