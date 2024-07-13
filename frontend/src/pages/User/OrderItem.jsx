import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderItem.css';
import { useCreateOrderMutation, useGetOrderByAuctionIdQuery, useUpdateOrderDeliveryStatusMutation } from '../../redux/api/orderApiSlice';
import { useUpdateAuctionMutation } from '../../redux/api/auctionApiSlice'; 
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next"

const OrderItem = () => {
  const { state } = useLocation();
  const auction = state?.auction;
  const category = state?.category;

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [createOrder, { isLoading: isCreating, isError }] = useCreateOrderMutation();
  const [updateAuction, {isLoading: isUpdating, error: updatingError}] = useUpdateAuctionMutation();
  const [updateOrderDeliveryStatus] = useUpdateOrderDeliveryStatusMutation();
  const navigate = useNavigate();

  const { data: order, error: getError, refetch, isLoading: getIsLoading } = useGetOrderByAuctionIdQuery(auction._id, {
    skip: !auction?.status
  });

 
  const [t] = useTranslation("global");

  useEffect(() => {
    auction.status?window.scrollTo(0, 140):window.scrollTo(0, 110)

  }, []);

  useEffect(()=>{
    if(auction.status === 'Delivered' && !order?.isDelivered){
      refetch();
    }
  },[])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({ orderItem: auction._id, shippingAddress });
      await updateAuction({
        auctionId: auction._id,
        status: 'Ordered'
      });
      
      navigate("/orderlist");
    } catch (error) {
      toast.error('Error creating order');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateAuction({
        auctionId: auction._id,
        status: newStatus
      });
      if(newStatus == 'Delivered'){
        await updateOrderDeliveryStatus({
          id: order._id,
          isDelivered: true 
        })
      
      }
     
   
      navigate("/orderlist");
    } catch (error) {
      toast.error(`Error updating auction status to ${newStatus}`);
    }
  };

  if (getIsLoading) {
    return <div className="loader-error-container">
      <div className="loader"></div>
    </div>;
  }

  if (getError) {
    return <div className="loader-error-container">
      <h1 className="error">{getError?.data?.message || getError.error}</h1>
    </div>;
  }
  


  return (
    <>
      {category === 'Selling' && !auction.status ? (
        <div className="pending-order">
        <div className="pending-order-container">
            <div className="pending-auction-info">
                <div className="pending-auction-name-img">
                  <h2>{auction.name}</h2>
                  <img src={auction.image} alt={auction.name} className="pending-auction-image" />
                </div>
                <p><b>{t('artist')}:</b> {auction.artist.userName}</p>
                <p><b>{t('category')}:</b>{auction.category}</p>
                <p><b>{t('country')}:</b> {auction.country}</p>
                <p><b>{t('auction_started')}:</b>{new Date(auction.auc_start).toLocaleString()}</p>
                <p><b>{t('auction_ended')}</b> {new Date(auction.auc_ends).toLocaleString()}</p>
            </div>
            <div className="pending-order-message">
                <h2>{t('waiting_for_buyer')}<span><u>{auction.topBidder.userName}</u></span>{t('to_provide')}</h2>
            </div>
        </div>
    </div>
      ) : (
        <>
          {auction.status ? (
            <div className="ordered-item">
              <div className="ordered-item-container centered">
                <div className="ordered-item-details">
                  <h2>{t('order_details')}</h2>
                  <h3>{order.orderItem.name}</h3>
                  <img src={order.orderItem.image} alt={order.orderItem.name} className="ordered-image" />
                  <h3>Status: <u>{auction.status}</u></h3>
                  <p><b>{t('first_name')}:</b> {order.user.firstName}</p>
                  <p><b>{t('last_name')}:</b> {order.user.lastName}</p>
                  <p><b>{t('username')}:</b> {order.user.userName}</p>
                  <p><b>{t('shipping_address')}:</b> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  <p><b>{t('item_price')}:</b> ${order.itemPrice}</p>
                  <p><b>{t('shipping')}:</b> ${order.shippingPrice}</p>
                  <p><b>{t('tax')}:</b> ${order.taxPrice}</p>
                  <p><b>{t('total')}:</b> ${order.totalPrice}</p>
                  <hr />
                  {category === 'Selling' && auction.status === 'Ordered' && (
                    <button  type='submit' disabled={isUpdating} onClick={() => handleStatusChange('Shipping')}>{isUpdating?t('updating'):t('mark_as_shipping')}</button>
                  )}
                  {category === 'Buying' && auction.status === 'Shipping' && (
                    <button type='submit' disabled={isUpdating} onClick={() => handleStatusChange('Delivered')}>{isUpdating?t('updating'):t('mark_as_delivered')}</button>
                  )}
                  {auction.status==='Delivered' && (
                    <p><b>{t('delivered_at')}: </b>{new Date(order.deliveredAt).toLocaleString()}</p>
                    
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="order-item">
              <div className="order-item-container">
                <div className="auction-info">
                  <h2>{auction.name}</h2>
                  <img src={auction.image} alt={auction.name} className="auction-image" />
                  <p><b>{t('artist')}:</b><Link to={`/user/${auction.artist.userName}`}> <br/> {auction.artist.userName}</Link></p>
                  <p><b>{t('category')}:</b> <br />{auction.category}</p>
                  <p><b>{t('country')}:</b> <br />{auction.country}</p>
                  <p><b>{t('auction_started')}:</b> <br />{new Date(auction.auc_start).toLocaleString()}</p>
                  <p><b>{t('auction_ended')}:</b> <br />{new Date(auction.auc_ends).toLocaleString()}</p>
                </div>
                <div className="order-form">
                  <h2>{t('create_order')}</h2>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="address">{t('address')}:</label>
                    <input type="text" id="address" name="address" value={shippingAddress.address} onChange={handleChange} required />
                    <label htmlFor="city">{t('city')}:</label>
                    <input type="text" id="city" name="city" value={shippingAddress.city} onChange={handleChange} required />
                    <label htmlFor="postalCode">{t('postal_code')}:</label>
                    <input type="text" id="postalCode" name="postalCode" value={shippingAddress.postalCode} onChange={handleChange} required />
                    <label htmlFor="country">{t('country')}:</label>
                    <input type="text" id="country" name="country" value={shippingAddress.country} onChange={handleChange} required />
                    <div className="order-form-submit-container">
                      <button type="submit" disabled={isCreating}>{isCreating?t('creating'):t('create_order')}</button>
                     
                    </div>
                  </form>
                </div>
                <div className="order-info">
                  <h2>{t('order_information')}</h2>
                  <p><b>{t('item_price')}:</b> ${auction.price}</p>
                  <p><b>{t('shipping')}:</b> {auction.price > 100 ? '$0.00' : '$25.00'}</p>
                  <p><b>{t('tax')}:</b> ${(auction.price * 0.1).toFixed(2)}</p>
                  <hr />
                  <p><b>{t('total')}:</b> ${(auction.price + (auction.price > 100 ? 0 : 25) + (auction.price * 0.1)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OrderItem;
