import { use, Suspense } from "react";
import "./App.css";

function BooksList({ booksPromise }) {
  const books = use(booksPromise);

  return (
    <div className="books-grid">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <div className="book-image">
            <img src={book.image_url} alt={book.title} />
          </div>
          <div className="book-info">
            <h2 className="book-title">{book.title}</h2>
            <h3 className="book-author">by {book.author}</h3>
            <p className="book-description">{book.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const booksPromise = fetch("/api/data").then((response) => {
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    return response.json();
  });

  return (
    <div className="library-container">
      <header className="library-header">
        <h1>My Library</h1>
        <p>Discover your next favorite book</p>
      </header>

      <Suspense fallback={<div className="loading">Loading books...</div>}>
        <BooksList booksPromise={booksPromise} />
      </Suspense>
    </div>
  );
}

export default App;
