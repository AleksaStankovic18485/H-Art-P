import React, { useContext,useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext';
import './UserProfile.css'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ArtItem from '../../components/ArtItem/ArtItem';
import {useTranslation} from "react-i18next"
const UserProfile = () => {

   
    const { data: auctions, error, refetch, isLoading } = useContext(StoreContext);
    

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

    useEffect(() => {
        window.scrollTo(0, 120);
    }, []);



    const { userInfo } = useSelector(state => state.login);
    const [t] = useTranslation("global");
    const currBiddingAuctions = auctions.filter(auction => auction.topBidder?._id == userInfo._id && auction.active);
    const pastBiddingAuctions = auctions.filter(auction => auction.topBidder?._id == userInfo._id && !auction.active)

    let currArtistAuctions = [];
    let pastArtistAuctions = [];

    if (userInfo.isArtist) {
        currArtistAuctions = auctions.filter(auction => auction.artist._id == userInfo._id && auction.active);
        pastArtistAuctions = auctions.filter(auction => auction.artist._id == userInfo._id && !auction.active)
    }

    return (
        <div className='user-profile'>
            <div className="user-profile-heading">
                <div className="user-profile-informations">
                    <h2 className="user-profile-username">{userInfo.userName}</h2>
                    <p className="user-profile-email">{userInfo.email}</p>
                    <Link to="/usersettings">{t('settings')}</Link>
                </div>

                {userInfo.isArtist ?
                    <div className="user-profile-auctions-container">
                        <h2 className="user-profile-auctions-heading">{t('currently_selling')}</h2>
                        {currArtistAuctions.length > 0 ?
                            <div className="auctions-display-list">
                                {currArtistAuctions.map((item) => {
                                    return <ArtItem key={item._id}
                                        item={item} live={true}
                                    />
                                })}
                            </div> :
                            <div className="no-auctions-message">
                                <h2>{t('no_auctions')}</h2>
                                <Link to="/artist/sell">{t('sell_now')}</Link>
                            </div>}

                        <h2 className="user-profile-auctions-heading">{t('previously_selling')}</h2>
                        {pastArtistAuctions.length > 0 ?
                            <div className="auctions-display-list">
                                {pastArtistAuctions.map((item) => {
                                    return <ArtItem key={item._id} item={item} fromProfileHistory={true}
                                    
                                    />
                                })}
                            </div> :
                            <div className="no-auctions-message">
                                <h2>{t('no_auctions')}</h2>
                                <Link to="/sell">{t('sell_now')}</Link>
                            </div>
                        }

                    </div> : <></>

                }

                <div className="user-profile-auctions-container">
                    <h2 className="user-profile-auctions-heading">{t('currently_bidding')}</h2>
                    {currBiddingAuctions.length > 0 ?
                        <div className="auctions-display-list">
                            {currBiddingAuctions.map((item) => {
                                return <ArtItem key={item._id} item={item} live={true}
                    
                                />
                            })}
                        </div> :

                        <div className="no-auctions-message">
                            <h2>{t('no_auctions')}</h2>
                            <Link to="/collection">{t('bid_now')}</Link>
                        </div>}



                    <h2 className="user-profile-auctions-heading">{t('previously_won')}</h2>
                    {pastBiddingAuctions.length > 0 ?
                        <div className="auctions-display-list">
                            {pastBiddingAuctions.map((item) => {
                                return <ArtItem key={item._id} item={item} fromProfileHistory={true}
                                />
                            })}
                        </div> :
                        <div className="no-auctions-message">
                            <h2>{t('no_auctions')}</h2>
                            <Link to="/collection">{t('bid_now')}</Link>
                        </div>}
                </div>

            </div>
        </div>
    )
}

export default UserProfile