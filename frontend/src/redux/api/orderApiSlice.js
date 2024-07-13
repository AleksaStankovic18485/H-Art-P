import { apiSlice } from './apiSlice';
import { ORDER_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: ORDER_URL,
                method: 'POST',
                body: orderData,
            }),
        }),
        getOrders: builder.query({
            query: () => ORDER_URL,
            providesTags: ["Order"],
        }),
        getOrderById: builder.query({
            query: (id) => `${ORDER_URL}/${id}`,
            providesTags: ["Order"],
        }),
        getOrderByAuctionId: builder.query({ 
            query: (auctionId) => `${ORDER_URL}/auction/${auctionId}`,
            providesTags: ["Order"],
        }),
        deleteOrderById: builder.mutation({
            query: (id) => ({
                url: `${ORDER_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        updateOrderDeliveryStatus: builder.mutation({
            query: ({ id, isDelivered }) => ({
                url: `${ORDER_URL}/${id}/deliver`,
                method: 'PUT',
                body: { isDelivered },
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});


export const {
    useCreateOrderMutation ,
    useGetOrdersQuery ,
    useGetOrderByIdQuery ,
    useGetOrderByAuctionIdQuery,
    useDeleteOrderByIdMutation ,
    useUpdateOrderDeliveryStatusMutation ,
} = orderApiSlice;