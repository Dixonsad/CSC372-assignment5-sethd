import { useState } from 'react';

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); 
    if (query) {
      onSearch(query); 
      setQuery(''); 
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '20px' }}>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search for a show..."
        style={{ padding: '8px', fontSize: '1rem', width: '250px' }}
      />
      <button type="submit" style={{ padding: '8px 15px', marginLeft: '10px' }}>Search</button>
    </form>
  );
}

export default SearchForm;
