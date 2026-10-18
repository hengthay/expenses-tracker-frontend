import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import Login from './page/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './page/Register'
import MainDashboardLayout from './components/layout/MainDashboardLayout'
import NotFound from './page/NotFound'
import WebInterface from './page/WebInterface'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<WebInterface />}/>
      <Route element={<MainDashboardLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<HomePage />} />
        </Route>
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      {/* Fallback */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App