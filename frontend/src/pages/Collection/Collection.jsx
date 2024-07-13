import React,{useState, useEffect} from 'react'
import './Collection.css'
import Navbar from '../../components/Navbar/Navbar'
import Auctions from '../../components/Auctions/Auctions'
import ExploreAuctions from '../../components/ExploreAuctions/ExploreAuctions'

const Collection = () => {
    
  const [category, setCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 1); 
  }, []);

  return (
    <div className='collection'>
        <ExploreAuctions category={category} setCategory={setCategory}/>
        <Auctions category={category}/>
    </div>
  )
}

export default Collection