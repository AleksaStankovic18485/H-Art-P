import React, { useState, useEffect, useContext, useRef } from 'react';
import './Bid.css';
import { calculateTimeLeft, formatTime } from '../../../modules/timeUtils';
import { StoreContext } from '../../context/StoreContext';
import { useParams } from 'react-router-dom';
import 'flag-icon-css/css/flag-icons.css'
import { getCode } from 'country-list';
import { useSelector } from 'react-redux';
import { useUpdateAuctionMutation } from '../../redux/api/auctionApiSlice';
import {useAddAuctionToOrderListMutation} from '../../redux/api/usersApiSlice'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next"
import {io} from 'socket.io-client';

const socket = io('http://localhost:4000'); 

const Bid = ({ setShowLogin }) => {
    
    
    const { itemName } = useParams();
    const { data, error, refetch, isLoading } = useContext(StoreContext);

    if (isLoading) {
        return (
            <div className="loader-error-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="loader-error-container">
                <h1 className="error">{error?.data?.message || error.error}</h1>
            </div>
        );
    }

    const { userInfo } = useSelector(state => state.login);
    const [updateAuction] = useUpdateAuctionMutation();
    const [addAuctionToOrderList] = useAddAuctionToOrderListMutation();
    const artItem = data.find((item) => item.name === itemName);

    const {name, image, price, artist, category, subcategory, country, dimensions, auc_start, auc_ends, active, topBidder } = artItem;

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auc_ends));
    const [bidAmount, setBidAmount] = useState('');
    const [bidError, setBidError] = useState('');
    const [isValidBid, setIsValidBid] = useState(false);
    const [t] = useTranslation("global");

    const intervalRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 150);
    }, []);

    useEffect(() => {
        if (!active) return;

        intervalRef.current = setInterval(() => {
            const timeLeft = calculateTimeLeft(auc_ends);
            setTimeLeft(timeLeft);

            if (timeLeft.total <= 0) {
                updateAuctionStatusToExpired();
                clearInterval(intervalRef.current);
            }
          
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [auc_ends, active]);

    // useEffect(() => {
    //     socket.on('bidUpdate', (updatedAuction) => {
    //         if(updatedAuction.topBidder !== userInfo._id){
    //             toast.info(`Someone just bidded ${updatedAuction.price}!`)
    //            }
    //         if (updatedAuction._id === artItem._id) {
    //             refetch();
    //         }
         
    //     });

    //     return () => {
    //         socket.off('bidUpdate');
            
    //     };
    // }, [artItem._id, refetch]);

    const updateAuctionStatusToExpired = async () => {

        try {

            const updatedAuctions = await refetch();
            const updatedAuction = updatedAuctions.data.find(a => a._id === artItem._id);

           
            if (updatedAuction && updatedAuction.active) {
                await updateAuction({
                    auctionId: artItem._id,
                    active: false
                });

                if (updatedAuction.topBidder) {
                    await addAuctionToOrderList({
                        userId: updatedAuction.topBidder._id,
                        auctionId: artItem._id
                    });
                    await addAuctionToOrderList({
                        userId: artist._id,
                        auctionId: artItem._id
                    });
                }
                
            }
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to update auction status");
        }
    };

    useEffect(() => {
        setIsValidBid(validateBid(bidAmount));
    }, [bidAmount]);

    const validateBid = (amount) => {
        if (!amount) {
            setBidError('');
            return false;
        }

        const bidValue = parseFloat(amount);
        let minBidIncrease = 0;

        if (price < 500) {
            minBidIncrease = 10;
        } else if (price >= 500 && price < 1000) {
            minBidIncrease = 25;
        } else {
            minBidIncrease = 50;
        }

        if (bidValue >= price + minBidIncrease) {
            setBidError('');
            document.querySelector('.bid-place-bid input').classList.remove('error');
            return true;
        } else {
            setBidError(t('offer_must_be')+minBidIncrease+t('higher_than'));
            document.querySelector('.bid-place-bid input').classList.add('error');
            return false;
        }
    };

    const handleBidChange = (e) => {
        const newBidAmount = e.target.value;
        setBidAmount(newBidAmount);
    };

    const placeBid = async () => {
        if (!userInfo) {
            setShowLogin(true);
            return;
        }
        try {
            const newAucEnds = new Date(auc_ends).getTime() + 60000; // Dodajemo 1 minut
            await updateAuction({
                auctionId: artItem._id,
                price: bidAmount,
                topBidder: userInfo._id,
                auc_ends: new Date(newAucEnds).toISOString()
            }).unwrap();

          

            // toast.success(`Bid placed successfully`);
            setBidAmount('');
        } catch (error) {
            console.error(error);
            toast.error("Bid placing failed. Try Again.");
        }
    };

    return (
        <div className='bid'>
            <div className="bid-content">
                <div className="bid-image">
                    <img src={image} alt={name} />
                </div>
                <div className="bid-details">
                    <h2>{name}</h2>
                    <div className='bid-author'>
                        <Link to={userInfo?._id==artist._id?'/userprofile'  : `/user/${artist.userName}`}>{artist.userName}</Link>
                    </div>
                    <p className='bid-country'>
                        <span className={`flag-icon flag-icon-${getCode(country).toLowerCase()}`}></span> {country}
                    </p>
                    <div className='bid-description'>
                        <p className='bid-category'>{category},</p>
                        <p className='bid-subcategory'>{subcategory}</p>
                    </div>
                    <div className="bid-size">
                        <p>{dimensions}</p>
                    </div>
                    <p className='bid-price'><span className='bid-price-text'>{t('price')}</span> ${price}</p>
                    {active ? (
                        <>
                        <div className="bid-time-left">
                            <p>{t('time_left')}</p>
                            <p className='bid-time-left-numbers'>
                                {formatTime(timeLeft.days)} : {formatTime(timeLeft.hours)} : {formatTime(timeLeft.minutes)} : {formatTime(timeLeft.seconds)}
                            </p>
                            <p className="bid-time-left-units">
                                days : hrs : mins : secs
                            </p>
                        </div>
                        
                        
                        {userInfo?._id === artItem.artist._id ? (
                                <div className='top-bidder-message'>
                                    {topBidder ? <h2>{t('top_bidder')}{topBidder.userName}</h2> : <h2>{t('no_bidders')}</h2>}
                                </div>
                            ) : userInfo && userInfo?._id === topBidder?._id ? (
                                <div className='top-bidder-message'>
                                    <h2>{t('you_are_top_bidder')}</h2>
                                </div>
                            ) : (
                                <div className="bid-place-bid">
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder={t('enter_bid_amount')}
                                        value={bidAmount}
                                        onChange={handleBidChange}
                                        className={bidError ? 'error' : ''}
                                    />
                                    <button type='submit' onClick={placeBid} disabled={!isValidBid}>{t('place_bid')}</button>
                                    {bidError && <p className="bid-error">{bidError}</p>}
                                </div>
                            )}
                        
                        
                        </>
                    ) : (
                        <>
                        <div className={active?'bid-time-left':'bid-time-left expired'}>
                            <p>{t('auction_expired')}</p>
                            <p>{new Date(auc_start).toLocaleString()}<br/>{new Date(auc_ends).toLocaleString()}</p>
                            <p className="bid-time-left-units">
                             {t('active_period')}
                            </p>
                        </div>
                        
                        <div className='top-bidder-message'>
                            {topBidder ? <h2>{t('winner')} {topBidder.userName}</h2> : <h2>{t('no_winner')}</h2>}
                        </div>
                        </>
                    )}
                 
                       
                        
                
                        
               
                </div>
            </div>
        </div>
    );
};

export default Bid;
