import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { supabase } from './supabase'
import './Auth.css'
import logo from './assets/logo.png'

const Auth = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [user, setUser] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        navigate('/')
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        navigate('/')
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [navigate])

  const handleLogOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(`Logout failed: ${error.message}`)
      } else {
        toast.success('Logged out successfully!')
        setUser(null)
        setTimeout(() => {
          navigate('/auth')
        }, 500)
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password) {
      toast.error('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email first')
        } else {
          toast.error(`Login failed: ${error.message}`)
        }
      } else if (data.user) {
        toast.success('Login successful!')
        setEmail('')
        setPassword('')
        setTimeout(() => {
          navigate('/')
        }, 500)
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered! Please sign in instead.')
        } else if (error.message.includes('rate limit')) {
          toast.error('Too many sign up attempts. Please wait and try again.')
        } else {
          toast.error(`Sign up failed: ${error.message}`)
        }
      } else if (data.user) {
        toast.success('Sign up successful! Check your email to confirm.')
        setEmail('')
        setPassword('')
        setFullName('')
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // If user is logged in, show logout screen
  if (user) {
    return (
      <div className='auth-container'>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={true}
        />
        <div className='auth-card'>
          <h1>Netflix Auth</h1>
          <div className='user-info'>
            <p>Logged in as:</p>
            <p className='user-email'>{user.email}</p>
          </div>
          <button 
            onClick={handleLogOut} 
            disabled={isLoading}
            className='logout-btn'
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    )
  }

  // Login/Sign Up form
  return (
    <div className='auth-container'>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={true}
      />
      <div className='auth-card'>
        <img src={logo} alt="Netflix" className='netflix-logo' />
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

        <form onSubmit={isSignUp ? handleSignUp : handleLogIn}>
          {isSignUp && (
            <div className='form-group'>
              <input
                type='text'
                placeholder='Full Name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className='form-group'>
            <input
              id='email'
              type='email'
              placeholder='Email or phone number'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <input
              id='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {!isSignUp && (
            <div className='form-options'>
              <label>
                <input type='checkbox' defaultChecked />
                Remember me
              </label>
              <a href='#'>Need help?</a>
            </div>
          )}

          <button 
            type='submit' 
            disabled={isLoading}
            className='submit-btn'
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className='toggle-section'>
          <p>
            {isSignUp ? 'Already have account?' : 'New to Netflix?'}
          </p>
          <button 
            type='button'
            onClick={() => {
              setIsSignUp(!isSignUp)
              setEmail('')
              setPassword('')
              setFullName('')
            }}
            className='toggle-btn'
          >
            {isSignUp ? 'Sign In Now' : 'Sign Up Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
