import React, { useState, useEffect } from 'react';
import './Hero.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import { assets } from '../../assets/assets';
import {useTranslation} from "react-i18next"

const Hero = () => {
  const [t] = useTranslation("global");
  const slides = [assets.hero_bg1, assets.hero_bg2, assets.hero_bg3, assets.hero_bg4];
  const texts = [
    <h2>REACH YOUR<br />FULL POTENTIAL</h2>,
    <h2>ENRICH YOUR<br />ART COLLECTION</h2>,
    <h2>DISCOVER YOUR<br />INNER CREATIVITY</h2>,
    <h2>EXPLORE NEW HORIZONS</h2>,
  ];

  const renderIndicator = (clickHandler, isSelected, index) => {

    const dotStyle = {
      width: isSelected ? '60px' : '50px', 
      height: isSelected ? '6px' : '4px',
      margin: '0 5px',
      backgroundColor: isSelected ? '#ddd' : '#ccc', 
      borderRadius: '0', 
      display: 'inline-block',
      cursor: 'pointer'
    };
  
    return (
      <span
        key={index}
        style={dotStyle}
        onClick={clickHandler}
      />
    );
  };

  return (
    <div className="hero" id='hero'>
      <Carousel   autoPlay={true}
        infiniteLoop={true}
        emulateTouch={true}
        showThumbs={false}  
        showStatus={false} 
        interval={ 5000 }
        renderIndicator={renderIndicator} 
      >
        
        {slides.map((slide, index) => {
          return (
            <div key={index} className="hero-slide">
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
              />
              {texts[index]};
            </div>
          );
        })}
      
      </Carousel>


    </div>
  );
};

export default Hero;