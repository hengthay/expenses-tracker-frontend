import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import Login from './page/Login'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App