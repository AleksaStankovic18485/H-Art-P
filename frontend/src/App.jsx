import React,{useContext, useState} from 'react'
import Home from './pages/Home/Home'
import {Route,Routes, useLocation} from 'react-router-dom'
import Collection from './pages/Collection/Collection'
import Bid from './pages/Bid/Bid'
import Navbar from './components/Navbar/Navbar'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { StoreContext } from './context/StoreContext'
import Footer from './components/Footer/Footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from './pages/Admin/AdminRoute'
import UserList from './pages/Admin/UserList'
import PrivateRoute from './pages/User/PrivateRoute'
import UserSettings from './pages/User/UserSettings'
import ArtistRoute from './pages/Artist/ArtistRoute'
import Sell from './pages/Artist/Sell'
import UserProfile from './pages/User/UserProfile'
import PublicProfile from './pages/PublicProfile/PublicProfile'
import OrderList from './pages/User/OrderList'
import OrderItem from './pages/User/OrderItem'
import Dashboard from './pages/Admin/Dashboard'
const App = () => {

  
  const {showLogin,setShowLogin} = useContext(StoreContext);

  const locType = useLocation()

  return (
    <>
      
      {showLogin?<LoginPopup setShowLogin={setShowLogin}/>
      :<></>}
  
      <ToastContainer />

      <div className='app'> 
        <Navbar type={locType.pathname} setShowLogin={setShowLogin}/>
      
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/bid/:itemName' element={<Bid  setShowLogin={setShowLogin}/>} />
            <Route path='/user/:userName' element={<PublicProfile/>} />
            <Route path="" element={<PrivateRoute />}>
              <Route path="/usersettings" element={<UserSettings />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/orderlist" element={<OrderList/>}/>
              <Route path="/orderlist/:auctionName" element={<OrderItem/>}></Route>
            </Route>
            <Route path='/artist' element={<ArtistRoute />}>
              <Route path="sell" element={<Sell />} />
            </Route>
            <Route path='/admin' element={<AdminRoute setShowLogin={setShowLogin}/>}>
              <Route path='userlist' element={<UserList/>}/>
              <Route path='dashboard' element={<Dashboard/>}/>
            </Route>
          </Routes>

          <Footer type={locType.pathname}/>

      </div>
    </>
  )
}

export default App