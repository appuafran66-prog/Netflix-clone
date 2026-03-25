import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useParams } from 'react-router-dom'

const Player = () => {

  const {id} = useParams();
    
 
   const [apiData, setApiData] = useState({
    name: "",
    Key: "",
    published_at: "",
    type: ""
   });

  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjZlZmZmOGMyNmNlM2ExY2M4ZjM5MzllYjJhMGJhYyIsIm5iZiI6MTc3NDQzOTczNy4zOTkwMDAyLCJzdWIiOiI2OWMzY2QzOWQ0YzQ1YmI1MTAzNTMyYjUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Q5oeEjKaNU88n3aMo9-VYKVofwW8LX5C3OST8NhbwD0'
  }
};

useEffect(() => {
   fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, options)
  .then(res => res.json())
  .then(res => setApiData(res.results[0]))
  .catch(err => console.error(err));
}, [])


  
  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="Back" />
      <iframe width='90%' height='90%' src={`https://www.youtube.com/embed/${apiData.Key}`} title="trailer" frameBorder="0" allowFullScreen></iframe>

      <div className="player-info">
        <p>{apiData.published_at.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div>
    </div>
  )
}

export default Player
