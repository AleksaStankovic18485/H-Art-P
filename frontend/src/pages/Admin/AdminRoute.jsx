import React from 'react'
import {useSelector} from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom'


const AdminRoute = ({setShowLogin}) => {

  const {userInfo} = useSelector(state => state.login)


  return userInfo && userInfo.isAdmin 
  ? (<Outlet/>) 
  : (<> {!userInfo ? setShowLogin(true) : <></>} <Navigate to='/' replace/> </>)
}

export default AdminRoute