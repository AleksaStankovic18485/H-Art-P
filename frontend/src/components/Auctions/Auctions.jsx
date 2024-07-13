import React, { useContext, useState, useEffect} from 'react';
import './Auctions.css';
import { StoreContext } from '../../context/StoreContext';
import ArtItem from '../ArtItem/ArtItem';

import {useTranslation} from "react-i18next"

const Auctions = ({ category }) => {

    const [t] = useTranslation("global");
    const {data:auctions, error, isLoading} = useContext(StoreContext);
   

    const [sortBy, setSortBy] = useState('auc_ends'); 
    const [sortOrder, setSortOrder] = useState('asc'); 

    

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

 
    const sortedAuctions = () => {
        if (!auctions) return []; 

        let activeAuctions = auctions.filter(auction => auction.active)

        let sorted = [...activeAuctions];


        if (sortBy === 'auc_ends') {
            sorted.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return new Date(a.auc_ends) - new Date(b.auc_ends);
                } else {
                    return new Date(b.auc_ends) - new Date(a.auc_ends);
                }
            });
        }
        
        else if (sortBy === 'price') {
            sorted.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        }

        return sorted;
    };

    const filteredAuctions = sortedAuctions().filter(item => category === "All" || category === item.category);

    return (
        <div className='auctions-list' id='auctions-list'>
            {isLoading ? (<h2>Loading...</h2>) : error ? (<h1>{error?.data?.message || error.error}</h1>)
                : (<>
                    <div className="sort-options">
                        <label>
                            {t('sort_by')}
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="auc_ends">{t('ending_soon')}</option>
                                <option value="price">{t('sort_price')}</option>
                            </select>
                        </label>
                        <label>
                            {t('order')}
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="asc">{t('ascending')}</option>
                                <option value="desc">{t('descending')}</option>
                            </select>
                        </label>
                    </div>

                    <div className="auctions-display-list">
                        {filteredAuctions.length > 0 ? (
                            filteredAuctions.map((item) => (
                                <ArtItem key={item._id} item={item} />
                            ))
                        ) : (
                            <div className="no-auctions-message">
                                <h2>NO AUCTIONS TO SHOW FOR THIS CATEGORY.</h2>
                            </div>
                        )}
                    </div>
                </>)}
        </div>
    );
};

export default Auctions;