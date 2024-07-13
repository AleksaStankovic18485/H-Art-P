import React, { useEffect, useState,useContext} from 'react';
import './OrderList.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { useSelector } from 'react-redux';
import {useTranslation} from "react-i18next"
const OrderList = () => {

    const { userInfo } = useSelector(state => state.login);
    const { orderList, orderListError, orderListRefetch, orderListLoading } = useContext(StoreContext);
    const navigate = useNavigate();
    const [t] = useTranslation("global");
    const initialCategory = sessionStorage.getItem('category') || 'Buying';
    const [category, setCategory] = useState(initialCategory);

    useEffect(() => {
        window.scrollTo(0, 100);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('category', category);
        if(!userInfo.isArtist){
            setCategory('Buying')
        }
    }, [category]);

    


    if (orderListLoading) {
        return <div className="loader-error-container">
            <div className="loader"></div>
        </div>
    }

    if (orderListError) {
        return <div className="loader-error-container">
            <h1 className="error">{orderListError?.data?.message || orderListError.error}</h1>
        </div>;
    }

    const sellingCount = orderList.filter(auction => auction.artist._id === userInfo._id && auction.status!='Delivered').length;
    const buyingCount = orderList.filter(auction => auction.artist._id !== userInfo._id  && auction.status!='Delivered').length;

    const filteredOrders = orderList.filter(auction => {
        if (category === 'Selling') {
            return auction.artist._id === userInfo._id;
        }
        return auction.artist._id !== userInfo._id;
    });

    const statusOrder = {
        'Pending': 0,
        'Ordered': 1,
        'Shipping': 2,
        'Delivered': 3
    };

    filteredOrders.sort((a, b) => {
        const statusA = a.status ? statusOrder[a.status] : statusOrder['Pending'];
        const statusB = b.status ? statusOrder[b.status] : statusOrder['Pending'];
        return statusA - statusB;
    });


    return (
        <div className="order-list">
            <div className='order-list-container'>
                <h2>Order List</h2>
                {userInfo.isArtist && (
                    <div className="category-buttons">
                        <button
                            className={category === 'Selling' ? 'active' : ''}
                            onClick={() => setCategory('Selling')}
                        >
                            {t("selling")} {sellingCount > 0 && <span className="badge">{sellingCount}</span>}
                        </button>
                        <button
                            className={category === 'Buying' ? 'active' : ''}
                            onClick={() => setCategory('Buying')}
                        >
                            {t("buying")} {buyingCount > 0 && <span className="badge">{buyingCount}</span>}
                        </button>
                    </div>
                )}
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((auction) => (
                        <div key={auction._id} className={`auction-item ${auction.status === 'Delivered' ? 'delivered' : ''}`} onClick={() => { navigate(`/orderlist/${encodeURIComponent(auction.name)}`, { state: { auction, category } }) }}>
                            <div className="auction-status">
                                {auction.status ? auction.status : <span className="status-pending">Pending</span>}
                            </div>
                            <img src={auction.image} alt={auction.name} className="auction-image" />
                            <div className="auction-details">
                                <h3>{auction.name}</h3>
                                <p>{t("artist")}: <b>{auction.artist.userName}</b></p>
                                <p>{t("category")}: <b>{auction.category}</b></p>
                                <p>{t("price")} <b>${auction.price}</b></p>
                                <p>{t("country")}: <b>{auction.country}</b></p>
                                <p>{t("auction_started")}: <b>{new Date(auction.auc_start).toLocaleString()}</b></p>
                                <p>{t("auction_ended")}: <b>{new Date(auction.auc_ends).toLocaleString()}</b></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-auctions-message">
                    <h2>No Orders to show.</h2>
                    {category=='Buying'?<Link to="/collection">Bid Now!</Link>:<Link to="/artist/sell">Sell Now!</Link>}
                </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;



