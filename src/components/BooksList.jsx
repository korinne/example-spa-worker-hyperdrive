import React, { use } from 'react';
import BookCard from './BookCard';

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

export default BooksList;