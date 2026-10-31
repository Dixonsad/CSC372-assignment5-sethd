import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stripHTML } from '../utils';

function ShowCard({ show }) {
  const [cast, setCast] = useState([]);
  const [castLoading, setCastLoading] = useState(true);
  const [castError, setCastError] = useState(null);

  // Fetch cast inside the card with the show ID as a dependency[cite: 9]
  useEffect(() => {
    const controller = new AbortController();
    
    fetch('https://api.tvmaze.com/shows/' + show.id + '/cast', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        let limit = 5;
        if (data.length < 5) limit = data.length;
        const limitedCast = [];
        for (let i = 0; i < limit; i++) {
          limitedCast.push(data[i]);
        }
        setCast(limitedCast);
        setCastLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setCastError(err.message);
          setCastLoading(false);
        }
      });
      
    return () => controller.abort();
  }, [show.id]); // The dependency array[cite: 181, 182]

  let genresStr = "Not available";
  if (show.genres && show.genres.length > 0) {
    genresStr = "";
    for (let i = 0; i < show.genres.length; i++) {
      genresStr += show.genres[i];
      if (i < show.genres.length - 1) genresStr += ", ";
    }
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', width: '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      {show.image && show.image.medium ? (
        <img src={show.image.medium} alt={show.name + " poster"} style={{ maxWidth: '100%' }} />
      ) : (
        <img src="https://via.placeholder.com/210x295?text=Not+Available" alt="Not available" style={{ maxWidth: '100%' }} />
      )}
      
      {/* Use Link, not an <a> tag, to avoid page reload[cite: 198] */}
      <h2><Link to={'/shows/' + show.id}>{show.name || "Not available"}</Link></h2>
      
      <p>{stripHTML(show.summary)}</p>
      <p>Premiered: {show.premiered || "Not available"}</p>
      <p>Last updated: {show.updated || "Not available"}</p>
      <p>Genres: {genresStr} | Rating: {show.rating?.average || "Not available"}</p>

      <h3>Main Cast:</h3>
      {castLoading && <p>Loading cast...</p>}
      {castError && <p>Cast not available.</p>}
      {!castLoading && !castError && cast.length === 0 && <p>Cast not available.</p>}
      {!castLoading && !castError && cast.length > 0 && (
        <ul>
          {cast.map(c => (
            <li key={c.person.id}>{c.person.name} as {c.character.name}</li>
          ))}
        </ul>
      )}
      <a href={show.url || "#"} target="_blank" rel="noreferrer">View on TVmaze</a>
    </div>
  );
}

export default ShowCard;