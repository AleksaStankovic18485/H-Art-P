import React,{useContext,useEffect} from 'react'
import Hero from '../../components/Hero/Hero.jsx'
import About from '../../components/About/About.jsx'
import './Home.css'
import Hot from '../../components/Hot/Hot.jsx'
import Join from '../../components/Join/Join.jsx'
import { StoreContext } from '../../context/StoreContext.jsx'

const Home = () => {

  const {showLogin,setShowLogin} = useContext(StoreContext);


  return (
    <>
      <Hero/>
      <Hot/>
      <Join setShowLogin={setShowLogin}/>
      <About/>
     </>
  )
}

export default Home