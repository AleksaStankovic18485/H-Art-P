import React, { useState, useEffect } from 'react';
import './Join.css';
import {useTranslation} from "react-i18next"
import {useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const Join = ({setShowLogin}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [t] = useTranslation("global");
  const { userInfo } = useSelector((state) => state.login);

  useEffect(() => {
    const handleScroll = () => {
      const joinSection = document.querySelector('.join-content');
      if (joinSection) {
        const joinPosition = joinSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (joinPosition < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`join ${isVisible ? 'appear' : ''}`}>
      <div className="join-content">
        <h2>{t('are_you_an_artist')}</h2>
        <p>{t('dive_into')}</p>
        {userInfo?(
          userInfo.isArtist? <Link to="/artist/sell">{t('sell_now')}</Link> : <Link to="/collection">{t('explore')}</Link>
        )
        :
        <button onClick={()=>setShowLogin(true)}>{t('see_more')}</button>}
      </div>
    </div>
  );
}

export default Join;
