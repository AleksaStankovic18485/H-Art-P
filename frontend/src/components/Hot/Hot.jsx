import React, { useContext, useEffect } from 'react';
import './Hot.css';
import {StoreContext} from '../../context/StoreContext';
import ArtItem from '../ArtItem/ArtItem';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next"


const Hot = () => {

    
    const {data:auctions, error, refetch, isLoading} = useContext(StoreContext);
    
    const [t] = useTranslation("global");

    const textItems = [
        t('available_now'),
        t('hot_auctions'),
        t('available_now'),
        t('hot_auctions'),
        t('available_now'),
        t('hot_auctions'),
        t('available_now'),
        t('hot_auctions'),
    ];

  

    if (isLoading) {
        return <div className="loader-error-container">
                    <div className="loader"></div>
                </div>
    }

    if (error) {
        return <div className="loader-error-container">
                    <h1 className="error">{error?.data?.message || error.error}</h1>
                </div>;
    }

    let activeAuctions = auctions.filter(auction => auction.active);

    const hot_auctions_list = [...activeAuctions]
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);

  
    return (
     
        <div className="hot" id="hot">
            <div className="hot-text-container">
                {Array.from({ length: 2 }, (_, i) => (
                    <div className="hot-text" key={i}>
                        {textItems.map((item, index) => (
                            <p className={index % 2 == 0 ? "available-now-text" : "hot-auctions-text"} key={index}>{item}</p>
                        ))}
                    </div>
                ))}
            </div>

            <div className="hot-display">
                <div className="hot-display-text">
                    <h2>{t('hot_collection')}</h2>
                    <div className='see-all'>
                        <Link to='/collection'><p>{t('see_all')}</p></Link>
                        <Link to='/collection'><img src={assets.right_arrow} alt="right_arrow" /></Link>
                    </div>
                </div>
                <div className="auctions-display-list">
                    {hot_auctions_list.map((item, index) => {
                        return <ArtItem key={item._id}
                           item={item} refetch={refetch}
                        />
                    })}
                </div>
            </div>
        </div>
        

    );
};

export default Hot;

