import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import SearchInfo from './components/SearchInfo';
import ShowList from './components/ShowList';
import ShowDetail from './components/ShowDetail';

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('pokemon');

  // Effect runs on first render and whenever searchTerm changes[cite: 182]
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setShows([]); // Clear old results

    fetch('https://api.tvmaze.com/search/shows?q=' + searchTerm, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        // Limit to 10 shows using basic loop
        let limit = 10;
        if (data.length < 10) limit = data.length;
        const limitedData = [];
        for (let i = 0; i < limit; i++) {
          limitedData.push(data[i]);
        }
        setShows(limitedData);
        setLoading(false);
      })
      .catch(err => {
        // Ignore AbortError from cleanup[cite: 187]
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup cancels stale requests when query changes[cite: 187]
    return () => controller.abort();
  }, [searchTerm]);

  // Callback function to pass down to SearchForm[cite: 193]
  function handleSearch(query) {
    setSearchTerm(query);
  }

  return (
    <BrowserRouter>
      <header style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#333', color: 'white' }}>
        <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TV Show Gallery</Link></h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={
            <>
              <SearchForm onSearch={handleSearch} />
              
              {/* This component shows the lifted state */}
              <SearchInfo term={searchTerm} count={shows.length} />
              
              {/* Conditional Rendering based on state[cite: 186, 200] */}
              {loading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              {!loading && !error && shows.length === 0 && <p>No matches found.</p>}
              {!loading && !error && shows.length > 0 && <ShowList shows={shows} />}
            </>
          } />
          <Route path="/shows/:id" element={<ShowDetail />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Data provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noreferrer">TVmaze</a></p>
      </footer>
    </BrowserRouter>
  );
}

export default App;