import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useParams, useNavigate } from 'react-router-dom'

const Player = () => {

  const {id} = useParams();
  const navigate = useNavigate();
    
  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjZlZmZmOGMyNmNlM2ExY2M4ZjM5MzllYjJhMGJhYyIsIm5iZiI6MTc3NDQzOTczNy4zOTkwMDAyLCJzdWIiOiI2OWMzY2QzOWQ0YzQ1YmI1MTAzNTMyYjUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Q5oeEjKaNU88n3aMo9-VYKVofwW8LX5C3OST8NhbwD0'
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, options)
      .then(res => res.json())
      .then(res => {
        if (res.results && res.results.length > 0) {
          // Try to find a trailer first, otherwise use first available video
          const trailer = res.results.find(
            video => video.type === "Trailer" && video.site === "YouTube"
          );
          const video = trailer || res.results.find(v => v.site === "YouTube");
          
          if (video) {
            setApiData(video);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching video:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='player'>
      <img 
        src={back_arrow_icon} 
        alt="Back" 
        onClick={handleBack}
        style={{ cursor: 'pointer' }}
      />
      
      {loading ? (
        <div style={{
          width: '90%',
          height: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '20px'
        }}>
          Loading video...
        </div>
      ) : error ? (
        <div style={{
          width: '90%',
          height: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '20px'
        }}>
          Video not available for this movie
        </div>
      ) : apiData.key ? (
        <iframe 
          width='90%' 
          height='90%' 
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title="trailer" 
          frameBorder="0" 
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      ) : null}

      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : '-'}</p>
        <p>{apiData.name || 'Video'}</p>
        <p>{apiData.type || 'No type'}</p>
      </div>
    </div>
  )
}

export default Player
