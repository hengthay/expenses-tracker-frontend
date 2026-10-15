import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser, selectCurrentUser } from '../feature/auth/authSlice';

const HomePage = () => {

  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const handleFetchCurrenUser = async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();    
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='text-black'>
      <button 
      onClick={handleFetchCurrenUser}
      className='m-4 p-2 min-w-40 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer'>
        Get User
      </button>
    </div>
  )
}

export default HomePage