import React from 'react'
import {useSelector} from 'react-redux'
import {Navigate, Outlet} from 'react-router-dom'


const ArtistRoute = () => {

  const {userInfo} = useSelector(state => state.login)


  return userInfo && userInfo.isArtist 
  ? <Outlet/>
  : <Navigate to="/" replace />;
}

export default ArtistRoute