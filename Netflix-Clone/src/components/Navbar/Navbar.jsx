import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_icon from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'

const Navbar = () => {
  const navRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    });
  }, []);

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/auth')
    } catch (err) {
      console.error('Logout failed:', err.message)
    }
  }

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        <img src={logo} alt="Netflix Logo" />
        <ul>
            <li>Home</li>
            <li>TV Shows</li>
            <li>Movies</li>
            <li>New & Popular</li>
            <li>My List</li>
            <li>Browse by Languages</li>
        </ul>
      </div>
      <div className="navbar-right">
     <img src={search_icon} alt="Search" className='icons' />
     <p>Children</p>
     <img src={bell_icon} alt="Notifications" className='icons' />
     <div className="navbar-profile">
        <img src={profile_icon} alt="Profile" className='profile' />
        <img src={caret_icon} alt=""  />
        <div className="dropdown">
            <p onClick={handleLogOut} style={{ cursor: 'pointer' }}>Sign Out of Netflix</p>
        </div>
     </div>
      </div>
    </div>
  )
}

export default Navbar
