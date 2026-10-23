import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './page/HomePage'
import Login from './page/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './page/Register'
import MainDashboardLayout from './components/layout/MainDashboardLayout'
import NotFound from './page/NotFound'
import WebInterface from './page/WebInterface'
import Category from './page/Category'
import CreateCategory from './components/category/CreateCategory'
import UpdateCategory from './components/category/UpdateCategory'
import Account from './page/Account'
import AdminAccount from './page/AdminAccount'
import AccountRoleBaseRoute from './components/AccountRoleBaseRoute'
import CreateAccount from './components/account/CreateAccount'
import UpdateAccount from './components/account/UpdateAccount'
import UserRoleBaseRoute from './components/UserRoleBaseRoute'
import UserProfile from './page/UserProfile'
import AdminUserProfile from './page/AdminUserProfile'
import AdminUpdateUser from './components/user/AdminUpdateUser'
import Transaction from './page/Transaction'
import AdminTransaction from './page/AdminTransaction'
import CreateTransaction from './components/transaction/CreateTransaction'
import UpdateTransaction from './components/transaction/UpdateTransaction'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<WebInterface />}/>
      <Route element={<MainDashboardLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<HomePage />} />
          <Route path='/categories' element={<Category />} />
          <Route path='/categories/create' element={<CreateCategory />} />
          <Route path='/categories/edit/:id' element={<UpdateCategory />} />
          {/* Dynamic route by account role */}
          <Route 
            path="/accounts" 
            element={
              <AccountRoleBaseRoute 
                userComponent={Account} 
                adminComponent={AdminAccount} 
              />
            }
          />
          <Route path='/accounts/create' element={<CreateAccount />}/>
          <Route path='/accounts/edit/:id' element={<UpdateAccount />}/>
          <Route 
            path="/users" 
            element={
              <UserRoleBaseRoute 
                userComponent={UserProfile} 
                adminComponent={AdminUserProfile} 
              />
            }
          />
          <Route path="/users/edit/:id" element={<AdminUpdateUser />} />
          <Route 
            path="/transactions" 
            element={
              <UserRoleBaseRoute 
                userComponent={Transaction} 
                adminComponent={AdminTransaction} 
              />
            }
          />
          <Route path="/transactions/create" element={<CreateTransaction />} />
          <Route path="/transactions/edit/:id" element={<UpdateTransaction />} />
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