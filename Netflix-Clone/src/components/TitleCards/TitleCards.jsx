import React, { useRef, useEffect, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'



const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjZlZmZmOGMyNmNlM2ExY2M4ZjM5MzllYjJhMGJhYyIsIm5iZiI6MTc3NDQzOTczNy4zOTkwMDAyLCJzdWIiOiI2OWMzY2QzOWQ0YzQ1YmI1MTAzNTMyYjUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Q5oeEjKaNU88n3aMo9-VYKVofwW8LX5C3OST8NhbwD0'
  }
};



const handleWheel = (event) => {
  event.preventDefault();
  cardsRef.current.scrollLeft += event.deltaY;
}


useEffect(() => {

  fetch(`https://api.themoviedb.org/3/movie/${category?category:'now_playing'}`, options)
  .then(res => res.json())
  .then(res => setApiData(res.results))
  .catch(err => console.error(err));

  cardsRef.current.addEventListener("wheel", handleWheel);
}, [category])

  return (
    <div className='title-cards'>
      <h2>{title?title:'Popular on Netflix'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <Link className="card" key={index} to={`/player/${card.id}`}>
            <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt="" className='card-img' />
            <p className='card-name'>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TitleCards
