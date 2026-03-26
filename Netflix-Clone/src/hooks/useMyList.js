import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export const useMyList = () => {
  const [myList, setMyList] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Get current logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError) {
          setError('No user logged in')
        } else {
          setUser(authUser)
          // Fetch user's list when component mounts
          if (authUser) {
            fetchMyList(authUser.id)
          }
        }
      } catch (err) {
        setError(err.message)
      }
    }

    getUser()
  }, [])

  // Fetch all movies in user's list
  const fetchMyList = async (userId) => {
    if (!userId) {
      setError('No user found')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: fetchError } = await supabase
        .from('my_list')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(`Failed to fetch list: ${fetchError.message}`)
      } else {
        setMyList(data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add movie to list
  const addToList = async (movieData) => {
    if (!user) {
      setError('Please login first to add to list')
      return false
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Check if movie is already in list
      const { data: existingMovie } = await supabase
        .from('my_list')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieData.movie_id)
        .single()

      if (existingMovie) {
        setError('This movie is already in your list')
        setLoading(false)
        return false
      }

      // Insert new movie to list
      const { data, error: insertError } = await supabase
        .from('my_list')
        .insert([
          {
            user_id: user.id,
            movie_id: movieData.movie_id,
            title: movieData.title || 'Unknown Title',
            poster_path: movieData.poster_path || null,
            movie_rating: movieData.movie_rating || null,
            movie_overview: movieData.movie_overview || null,
          }
        ])
        .select()

      if (insertError) {
        setError(`Failed to add to list: ${insertError.message}`)
        return false
      } else {
        setSuccess('Added to your list!')
        // Add new movie to local state
        setMyList([data[0], ...myList])
        setTimeout(() => setSuccess(''), 3000)
        return true
      }
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Remove movie from list
  const removeFromList = async (movieId) => {
    if (!user) {
      setError('No user logged in')
      return false
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: deleteError } = await supabase
        .from('my_list')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId)

      if (deleteError) {
        setError(`Failed to remove: ${deleteError.message}`)
        return false
      } else {
        setSuccess('Removed from your list!')
        // Remove from local state
        setMyList(myList.filter(item => item.movie_id !== movieId))
        setTimeout(() => setSuccess(''), 3000)
        return true
      }
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Check if movie is in list
  const isInList = (movieId) => {
    return myList.some(item => item.movie_id === movieId)
  }

  // Clear all messages
  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  return {
    myList,
    user,
    loading,
    error,
    success,
    addToList,
    removeFromList,
    fetchMyList,
    isInList,
    clearMessages,
  }
}
