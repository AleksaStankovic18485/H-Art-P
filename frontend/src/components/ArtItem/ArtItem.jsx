import React, { useState, useEffect, useRef, useContext} from 'react';
import './ArtItem.css';
import { Link } from 'react-router-dom';
import { calculateTimeLeft, formatTime } from '../../../modules/timeUtils';
import { useUpdateAuctionMutation } from '../../redux/api/auctionApiSlice'
import {useAddAuctionToOrderListMutation} from '../../redux/api/usersApiSlice'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext';
import {useTranslation} from "react-i18next"
import {io} from 'socket.io-client';

const socket = io('http://localhost:4000'); 

const ArtItem = ({ item, fromProfileHistory, live}) => {
   
    const [t] = useTranslation("global");
    const { _id, name, image, price, artist, category, auc_ends, active, topBidder } = item;

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auc_ends));

    const intervalRef = useRef(null);
   
    const {refetch} = useContext(StoreContext);
    useEffect(() => {
        if(!active) return; 

        intervalRef.current = setInterval(() => {
            
                const timeLeft = calculateTimeLeft(auc_ends);
                setTimeLeft(timeLeft);

                if (timeLeft.total <= 0) {
                    
                    updateAuctionStatusToExpired();
                    clearInterval(intervalRef.current); // zaustavljanje intervala odmah nakon azuriranja
                }
            
               
           
        }, 1000);

        return () => clearInterval(intervalRef.current); // ciscenje intervala kada se komponenta demontira
    }, [auc_ends, active]);



    useEffect(() => {
        socket.on('newAuction', (newAuction) => {
            refetch(); // Refetch podataka o aukcijama
        });

        return () => {
            socket.off('newAuction');
        };
    }, [refetch]);
    

    const [updateAuction] = useUpdateAuctionMutation();
    const [addAuctionToOrderList] = useAddAuctionToOrderListMutation();

    const updateAuctionStatusToExpired = async () => {
        try {
           
            const updatedAuctions = await refetch();
            const updatedAuction = updatedAuctions.data.find(a => a._id === _id);

            // da se ne bi slalo vise od 1 PUT metode, salje se samo prva pa onaj naredni PUT ne prolazi jer nije vise active
            if (updatedAuction && updatedAuction.active) {
                await updateAuction({
                    auctionId: _id,
                    active: false
                });

                if (updatedAuction.topBidder) {
                    await addAuctionToOrderList({
                        userId: updatedAuction.topBidder._id,
                        auctionId: _id
                    });
                    await addAuctionToOrderList({
                        userId: artist._id,
                        auctionId: _id
                    });
                }
                
            }
           
        } catch (error) {
            console.error(error);
            toast.error("Failed to update auction status");
        }
    };

    return (
        <Link to={`/bid/${name}`} className={fromProfileHistory?'history art-item':live?'live art-item':'art-item'}>
            <div className='art-item-image-container'>
                <img src={image} className="art-item-image" alt="art-item-image" />
            </div>

            <div className="art-item-info">
                <div className="art-item-name-container">
                    <p className="art-item-name">{name}</p>
                </div>
               
                <p className="art-item-artist">
                    {artist.userName}
                </p>
                <div className="art-item-category-price">
                    <p className="art-item-price">
                        ${price}
                    </p>
                    <p className="art-item-category">{category}</p>
                </div>

            </div>
            <div className="art-item-time-left">
                {fromProfileHistory ?
                    <>
                        <p className="art-item-expired">
                            {t('expired')}
                        </p>

                        <p className='art-item-expired-info'>
                            {t('click_for_more_info')}
                        </p>
                    </>
                    :
                    <>

                        <p className="art-item-time-numbers">
                            {formatTime(timeLeft.days)} : {formatTime(timeLeft.hours)} : {formatTime(timeLeft.minutes)} : {formatTime(timeLeft.seconds)}
                        </p>

                        <p className="art-item-time-units">
                            days : hrs : mins : secs
                        </p>
                    </>

                }



            </div>


        </Link>
    );
};

export default ArtItem;
