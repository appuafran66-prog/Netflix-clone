// Example: How to Add "Add to My List" to TitleCards Component

import React, { useRef, useEffect, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'
import { useMyList } from '../../hooks/useMyList'

const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([])
  const cardsRef = useRef()
  const { addToList, removeFromList, isInList, success, error } = useMyList()

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjZlZmZmOGMyNmNlM2ExY2M4ZjM5MzllYjJhMGJhYyIsIm5iZiI6MTc3NDQzOTczNy4zOTkwMDAyLCJzdWIiOiI2OWMzY2QzOWQ0YzQ1YmI1MTAzNTMyYjUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Q5oeEjKaNU88n3aMo9-VYKVofwW8LX5C3OST8NhbwD0'
    }
  };

  const handleWheel = (event) => {
    event.preventDefault()
    cardsRef.current.scrollLeft += event.deltaY
  }

  // Handle add to list
  const handleAddToList = async (e, card) => {
    e.preventDefault()
    e.stopPropagation()

    await addToList({
      movie_id: card.id.toString(),
      title: card.original_title || card.title,
      poster_path: card.poster_path,
      movie_rating: card.vote_average,
      movie_overview: card.overview
    })
  }

  // Handle remove from list
  const handleRemoveFromList = async (e, card) => {
    e.preventDefault()
    e.stopPropagation()

    await removeFromList(card.id.toString())
  }

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${category?category:'now_playing'}`, options)
      .then(res => res.json())
      .then(res => setApiData(res.results))
      .catch(err => console.error(err))

    cardsRef.current.addEventListener("wheel", handleWheel)
  }, [])

  return (
    <div className='title-cards'>
      <h2>{title?title:'Popular on Netflix'}</h2>
      {success && <div className='toast success'>{success}</div>}
      {error && <div className='toast error'>{error}</div>}
      
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const movieId = card.id.toString()
          const inList = isInList(movieId)
          
          return (
            <div className="card-wrapper" key={index}>
              <Link className="card" to={`/player/${card.id}`}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} 
                  alt="" 
                  className='card-img' 
                />
                <p className='card-name'>{card.original_title}</p>
              </Link>
              
              {/* Add to List Button */}
              <button
                className={`list-btn ${inList ? 'in-list' : ''}`}
                onClick={(e) => inList ? handleRemoveFromList(e, card) : handleAddToList(e, card)}
                title={inList ? 'Remove from list' : 'Add to list'}
              >
                {inList ? '✓' : '+'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards

/* 
  CSS to add to TitleCards.css:

  .card-wrapper {
    position: relative;
    display: inline-block;
  }

  .list-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(229, 9, 20, 0.8);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    opacity: 0;
  }

  .card-wrapper:hover .list-btn {
    opacity: 1;
  }

  .list-btn:hover {
    background: #e50914;
    transform: scale(1.1);
  }

  .list-btn.in-list {
    background: rgba(40, 167, 69, 0.8);
    opacity: 1;
  }

  .list-btn.in-list:hover {
    background: #28a745;
  }

  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }

  .toast.success {
    background: #28a745;
    color: white;
  }

  .toast.error {
    background: #dc3545;
    color: white;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
*/
