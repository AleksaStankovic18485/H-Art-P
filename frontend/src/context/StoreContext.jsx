import {createContext} from 'react'
import React,{useState,useEffect} from 'react'
import { useGetAuctionsQuery } from "../redux/api/auctionApiSlice"
import { useGetUserOrderListQuery } from '../redux/api/usersApiSlice';
import { useSelector } from 'react-redux';

export const StoreContext = createContext(null)

import {io} from 'socket.io-client';
import {toast} from 'react-toastify'
const socket = io('http://localhost:4000'); 
const StoreContextProvider = (props) =>{

    const { data, error,refetch, isLoading } = useGetAuctionsQuery();
    const { userInfo } = useSelector(state => state.login);
    const { data: orderList, refetch: orderListRefetch, error: orderListError, isLoading: orderListLoading } = useGetUserOrderListQuery(userInfo?._id, {
        skip: !userInfo?._id
    });
    const [showLogin,setShowLogin] = useState(false);
    const contextValue = {
        data,
        error,
        isLoading,
        refetch,
        orderList,
        orderListError,
        orderListLoading,
        showLogin,
        setShowLogin
    }

    useEffect(() => {
        socket.on('newAuction', () => {
            refetch();
            toast.info('New auction just dropped!');
        });

        socket.on('auctionUpdate', (updatedAuction) => {
            refetch();
            if(updatedAuction.active){
                if(updatedAuction.topBidder._id === userInfo?._id){
                    toast.success('Bid placed successfully!')
                }
                else{
                 toast.info(`${updatedAuction.topBidder.userName} just bid $${updatedAuction.price} on ${updatedAuction.name}!`); 
                }
            }
            else if(!updatedAuction.active && !updatedAuction.status){
                toast.info(`Auction for ${updatedAuction.name} has expired at ${new Date(updatedAuction.auc_ends).toLocaleString()}.Winner: ${updatedAuction.topBidder?updatedAuction.topBidder.userName:'No Winner.'}`);
            }
            else{
                if(updatedAuction.topBidder._id === userInfo?._id || updatedAuction.artist === userInfo?._id){
                    
                    orderListRefetch();
        
                    toast.info(`Order Status changed for ${updatedAuction.name}`)
                }
            }
    
        });


        socket.on('addedAuction', () => {
            orderListRefetch();
        });



        return () => {
            socket.off('newAuction');
            socket.off('auctionUpdate');
            socket.off('addedAuction');
           
           
        };
    }, [refetch]);

  
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;