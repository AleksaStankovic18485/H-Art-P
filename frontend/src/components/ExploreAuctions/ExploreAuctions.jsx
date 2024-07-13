import React, { useRef } from 'react';
import './ExploreAuctions.css';
import { category_list } from '../../assets/assets';
import {useTranslation} from "react-i18next"

const ExploreAuctions = ({ category, setCategory }) => {

  const [t] = useTranslation("global");


  const handleClick = (categoryName) => {
    setCategory((prev) => (prev === categoryName ? 'All' : categoryName));
    window.scrollTo(0, 350);
   
  };

  return (
    <div className='explore-auctions'>
      <div className='explore-auctions-heading'>
        <h2>H-ART {t('auctions')}</h2>

      </div>
      <div className='explore-auctions-categories'>
        {category_list.map((item, index) => (
          <div
            onClick={() => handleClick(item.category_name)}
            key={index}
            className='explore-auctions-categories-item'
          >
            <img className={category === item.category_name ? 'active' : ''} src={item.category_image} alt='' />
            <p>{item.category_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreAuctions;
