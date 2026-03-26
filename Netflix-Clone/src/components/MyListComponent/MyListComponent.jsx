import React, { useState } from 'react'
import { useMyList } from '../../hooks/useMyList'
import './MyListComponent.css'

const MyListComponent = () => {
  const { myList, user, loading, error, success, addToList, removeFromList, isInList, clearMessages } = useMyList()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    movie_id: '',
    title: '',
    poster_path: '',
    movie_rating: '',
    movie_overview: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddMovie = async (e) => {
    e.preventDefault()
    if (formData.movie_id.trim() === '') {
      alert('Please enter a movie ID')
      return
    }

    const success = await addToList(formData)
    if (success) {
      setFormData({
        movie_id: '',
        title: '',
        poster_path: '',
        movie_rating: '',
        movie_overview: ''
      })
      setShowModal(false)
    }
  }

  const handleRemove = (movieId) => {
    if (window.confirm('Remove this movie from your list?')) {
      removeFromList(movieId)
    }
  }

  if (!user) {
    return (
      <div className='my-list-container'>
        <div className='no-user-message'>
          <p>Please login to view your list</p>
        </div>
      </div>
    )
  }

  return (
    <div className='my-list-container'>
      <div className='my-list-header'>
        <h2>My List</h2>
        <button 
          className='add-btn'
          onClick={() => {
            setShowModal(true)
            clearMessages()
          }}
          disabled={loading}
        >
          + Add Movie
        </button>
      </div>

      {error && <div className='alert error'>{error}</div>}
      {success && <div className='alert success'>{success}</div>}

      {loading && <div className='loading'>Loading...</div>}

      {!loading && myList.length === 0 ? (
        <div className='empty-list'>
          <p>Your list is empty. Add movies to get started!</p>
        </div>
      ) : (
        <div className='list-grid'>
          {myList.map((item) => (
            <div key={item.id} className='list-item'>
              {item.poster_path && (
                <img 
                  src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                  alt={item.title}
                  className='poster'
                />
              )}
              <div className='item-info'>
                <h3>{item.title}</h3>
                {item.movie_rating && <p className='rating'>⭐ {item.movie_rating}</p>}
                {item.movie_overview && <p className='overview'>{item.movie_overview.substring(0, 100)}...</p>}
                <button 
                  className='remove-btn'
                  onClick={() => handleRemove(item.movie_id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>Add Movie to List</h3>
            <form onSubmit={handleAddMovie}>
              <input
                type='text'
                name='movie_id'
                placeholder='Movie ID (required)'
                value={formData.movie_id}
                onChange={handleInputChange}
                required
              />
              <input
                type='text'
                name='title'
                placeholder='Movie Title'
                value={formData.title}
                onChange={handleInputChange}
              />
              <input
                type='text'
                name='poster_path'
                placeholder='Poster Path (from TMDB)'
                value={formData.poster_path}
                onChange={handleInputChange}
              />
              <input
                type='number'
                name='movie_rating'
                placeholder='Rating (0-10)'
                value={formData.movie_rating}
                onChange={handleInputChange}
                step='0.1'
              />
              <textarea
                name='movie_overview'
                placeholder='Movie Overview'
                value={formData.movie_overview}
                onChange={handleInputChange}
                rows='3'
              ></textarea>

              <div className='modal-buttons'>
                <button 
                  type='submit' 
                  disabled={loading}
                  className='submit-btn'
                >
                  {loading ? 'Adding...' : 'Add to List'}
                </button>
                <button 
                  type='button'
                  onClick={() => {
                    setShowModal(false)
                    clearMessages()
                  }}
                  className='cancel-btn'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListComponent
