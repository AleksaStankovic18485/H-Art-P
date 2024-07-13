import React,{useEffect,useContext} from 'react'
import { StoreContext } from '../../context/StoreContext';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetUserByUserNameQuery } from '../../redux/api/usersApiSlice'
import ArtItem from '../../components/ArtItem/ArtItem';
import {useTranslation} from "react-i18next"
  
const PublicProfile = () => {

    const [t] = useTranslation("global");
  const { userInfo } = useSelector(state => state.login);
  const { userName:artistName } = useParams();
  const navigate = useNavigate();

  const { data: artistInfo, error, isLoading } = useGetUserByUserNameQuery(artistName);
  const { data: auctions, error:aucError, refetch, isLoading:aucIsLoading } = useContext(StoreContext);

  useEffect(() => {
    window.scrollTo(0, 120);
}, []);

  useEffect(() => {
    if (userInfo?.userName === artistName) {
      navigate('/userprofile');
    }
  }, [userInfo, artistName, navigate]);

  if (isLoading||aucIsLoading) {
    return (
        <div className="loader-error-container">
            <div className="loader"></div>
        </div>
    );
}

if (error||aucError) {
    return (
        <div className="loader-error-container">
            <h1 className="error">{error?.data?.message || error.error || aucError?.data?.message || aucError.error }</h1>
        </div>
    );
}

const currArtistAuctions = auctions.filter(auction => auction.artist._id == artistInfo._id && auction.active);
const pastArtistAuctions = auctions.filter(auction => auction.artist._id == artistInfo._id && !auction.active)


  return (
    <div className='user-profile'>
            <div className="user-profile-heading">
                <div className="user-profile-informations">
                    <h2 className="user-profile-username">{artistInfo.userName}</h2>
                    <p className="user-profile-email">{artistInfo.email}</p>
                </div>

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
                                <Link to="/collection">{t('explore_more')}</Link>
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
                                <Link to="/collection">{t('explore_more')}</Link>
                            </div>
                        }

                    
    
                </div>
            </div>
        </div>
  );
}

export default PublicProfile