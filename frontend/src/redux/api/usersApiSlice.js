import { apiSlice } from './apiSlice';
import { USER_URL } from '../constants';


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/signup`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: "POST",
            }),
        }),
        settings: builder.mutation({
            query: (data) => ({
              url: `${USER_URL}/profileUpdate`,
              method: "PUT",
              body: data,
            }),invalidatesTags: ['User', 'Auctions', 'Order'],
        }),
        getUserByUserName: builder.query({
            query: (userName) => ({
                url: `${USER_URL}/username/${userName}`,
            }),
        }),
        getUsers: builder.query({ //admin
            query: () => ({
                url: `${USER_URL}/adminGetUsers`,
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({ //admin
            query: (userId) => ({
                url: `${USER_URL}/delete/${userId}`,
                method: "DELETE",
            }),
        }),
        updateUser: builder.mutation({ //admin
            query: (data) => ({
                url: `${USER_URL}/${data.userId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        addAuctionToOrderList: builder.mutation({
            query: ({ userId, auctionId }) => ({
                url: `${USER_URL}/addAuctionToOrderList`,
                method: 'POST',
                body: { userId, auctionId },
            }),
            invalidatesTags:["User"]
        }),
        removeAuctionFromOrderList: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/orderList/remove`,
                method: 'DELETE',
                body: data,
            }),
        }),

        getUserOrderList: builder.query({
            query: (userId) => ({
                url: `${USER_URL}/${userId}/orderlist`,
            }),
            providesTags: ["Auctions","User"]
        }),
    
    }),
}); //treba mi kad se ide addToOrder list to treba da trigeruje web soket tako da svi vide
// u orderlist treba useEffect to da proveri isto kao sto smo imali kod sell bid


export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useSettingsMutation,
    useGetUserByUserNameQuery,
    useAddAuctionToOrderListMutation,
    useRemoveAuctionFromOrderListMutation,
    useGetUserOrderListQuery
} = userApiSlice;