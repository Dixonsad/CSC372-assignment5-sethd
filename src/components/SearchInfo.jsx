function SearchInfo({ term, count }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
      <p>Showing {count} results for "{term}"</p>
    </div>
  );
}

export default SearchInfo;