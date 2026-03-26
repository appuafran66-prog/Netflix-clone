import React from 'react'
import Home from './pages/Home/Home'
import { Routes, Route } from 'react-router-dom'
import Auth from './Auth'
import Player from './pages/Player/Player'
import MyListComponent from './components/MyListComponent/MyListComponent'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mylist" element={<MyListComponent />} />
        <Route path="/player/:id" element={<Player />} />
      </Routes>
    </div>
  )
}



export default App
