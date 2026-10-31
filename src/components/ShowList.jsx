import ShowCard from './ShowCard';

function ShowList({ shows }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {/* Render lists from API data with map() and stable keys */}
      {shows.map(item => (
        <ShowCard key={item.show.id} show={item.show} />
      ))}
    </div>
  );
}

export default ShowList;