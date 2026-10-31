import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { stripHTML } from '../utils';

function ShowDetail() {
  const { id } = useParams(); // useParams reads values from the URL[cite: 199]
  
  const [show, setShow] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the individual show AND cast data based on the URL parameter[cite: 9, 199]
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch('https://api.tvmaze.com/shows/' + id, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(showData => {
        setShow(showData);
        // Chain the second fetch for cast data[cite: 186]
        return fetch('https://api.tvmaze.com/shows/' + id + '/cast', { signal: controller.signal });
      })
      .then(res => {
         if (!res.ok) throw new Error('HTTP ' + res.status);
         return res.json();
      })
      .then(castData => {
        let limit = 15;
        if (castData.length < 15) limit = castData.length;
        const limitedCast = [];
        for(let i = 0; i < limit; i++) {
          limitedCast.push(castData[i]);
        }
        setCast(limitedCast);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading show details...</p>;
  if (error) return <p style={{ textAlign: 'center' }}>Error loading show: {error}</p>;
  if (!show) return <p style={{ textAlign: 'center' }}>Show not found.</p>;

  let genresStr = "Not available";
  if (show.genres && show.genres.length > 0) {
    genresStr = "";
    for (let i = 0; i < show.genres.length; i++) {
      genresStr += show.genres[i];
      if (i < show.genres.length - 1) genresStr += ", ";
    }
  }

  let networkStr = "Not available";
  if (show.network && show.network.name) {
    networkStr = show.network.name;
  } else if (show.webChannel && show.webChannel.name) {
    networkStr = show.webChannel.name;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <p><Link to="/">← Back to Gallery</Link></p>
      
      <h2>{show.name || "Not available"}</h2>
      {show.image && show.image.original ? (
        <img src={show.image.original} alt={show.name + " poster"} style={{ maxWidth: '300px' }} />
      ) : (
        <p>Poster not available</p>
      )}
      
      <p>{stripHTML(show.summary)}</p>
      <p>Premiered: {show.premiered || "Not available"}</p>
      <p>Status: {show.status || "Not available"}</p>
      <p>Network/Channel: {networkStr}</p>
      <p>Genres: {genresStr} | Rating: {show.rating?.average || "Not available"}</p>

      <h3>Full Cast (up to 15):</h3>
      {cast.length === 0 ? <p>Cast not available.</p> : (
        <ul>
          {cast.map(c => (
            <li key={c.person.id}>{c.person.name} as {c.character.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowDetail;