import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// First, define all your components before using them in the App component

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LibraVerse</h1>
          <p className="hero-subtitle">Your Digital Library Sanctuary</p>
          <div className="cta-buttons">
            <Link to="/add-book" className="cta-button primary">
              <span className="button-icon">➕</span> Add a Book
            </Link>
            <Link to="/view-books" className="cta-button secondary">
              <span className="button-icon">📚</span> Browse Collection
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="section-title">Why Choose LibraVerse?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Discovery</h3>
            <p>Find your next favorite book with our intuitive search</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Catalog</h3>
            <p>Organized collection with powerful filtering options</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Real-time Sync</h3>
            <p>Instant updates across all your devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Form = ({ onBookAdded }) => {
  const navigate = useNavigate();
  const [BookName, setBookName] = useState('');
  const [AuthorName, setAuthorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const book = {
      title: BookName,
      author: AuthorName
    };

    fetch('http://localhost:8080/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      onBookAdded(data);
      setBookName('');
      setAuthorName('');
      navigate('/view-books');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Add a New Book</h2>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="book-name" className="form-label">Book Title</label>
            <input 
              value={BookName} 
              onChange={(e) => setBookName(e.target.value)} 
              id="book-name" 
              type="text" 
              className="form-input"
              placeholder="Enter book title"
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="author-name" className="form-label">Author</label>
            <input 
              value={AuthorName} 
              onChange={(e) => setAuthorName(e.target.value)} 
              id="author-name" 
              type="text" 
              className="form-input"
              placeholder="Enter author name"
              required 
            />
          </div>
          <button type="submit" className="submit-button">
            Add to Library
          </button>
        </form>
      </div>
    </div>
  );
};

const ViewBooks = ({ books }) => {
  return (
    <div className="books-page">
      <h2 className="books-title">Library Collection</h2>
      {books.length === 0 ? (
        <div className="empty-library">
          <div className="empty-icon">📚</div>
          <h3>Your library is empty</h3>
          <p>Add some books to get started!</p>
          <Link to="/add-book" className="cta-button primary">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <div className="book-cover">
                <span className="cover-letter">{book.title.charAt(0)}</span>
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Now define the App component after all other components
const App = () => {
  const [books, setBooks] = useState([]);

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook]);
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="nav-logo">LibraVerse</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/add-book" className="nav-link">Add Book</Link>
            <Link to="/view-books" className="nav-link">View Books</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-book" element={<Form onBookAdded={handleBookAdded} />} />
          <Route path="/view-books" element={<ViewBooks books={books} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;