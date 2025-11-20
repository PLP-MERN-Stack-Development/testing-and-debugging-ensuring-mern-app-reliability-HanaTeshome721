import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoginForm from './components/LoginForm';
import PostList from './components/PostList';
import Button from './components/Button';
import './App.css';

function App() {
  const handleLoginSuccess = () => {
    console.log('Login successful');
    // Redirect or update UI
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <header className="App-header">
            <nav>
              <Link to="/">Home</Link>
              <Link to="/posts">Posts</Link>
              <Link to="/login">Login</Link>
            </nav>
          </header>

          <main className="App-main">
            <Routes>
              <Route 
                path="/" 
                element={
                  <div>
                    <h1>Welcome to MERN Testing App</h1>
                    <p>This is a comprehensive testing example application.</p>
                  </div>
                } 
              />
              <Route 
                path="/login" 
                element={<LoginForm onSuccess={handleLoginSuccess} />} 
              />
              <Route 
                path="/posts" 
                element={<PostList />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

