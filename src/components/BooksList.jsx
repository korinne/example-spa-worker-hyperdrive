import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BookCard from './BookCard';

function BooksList({ booksPromise, filter, onSelectBook }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksPromise;
        setBooks(data);
      } catch (error) {
        console.error("Error loading books:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [booksPromise]);
  
  // No genre transformation needed, just filter books by the selected genre
  const filteredBooks = filter
    ? books.filter(book => book.genre === filter)
    : books;
  
  const handleBookSelect = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredBooks.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onClick={() => handleBookSelect(book.id)}
        />
      ))}
    </div>
  );
}

export default BooksList;