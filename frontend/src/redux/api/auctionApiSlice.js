import {AUCTION_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const auctionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({  
    getAuctions: builder.query({
      query: () => ({
                url: `${AUCTION_URL}`,
            }),
      keepUnusedDataFor: 5,
      providesTags: ["Auctions","User"],
    }),

    getAuctionById: builder.query({
      query: (auctionId) => `${AUCTION_URL}/${auctionId}`,
      providesTags: (result, error, auctionId) => [
        { type: "Auction", id: auctionId },
      ],
    }),

    createAuction: builder.mutation({ 
      query: (auctionData) => ({
        url: `${AUCTION_URL}`,
        method: "POST",
        body: auctionData,
      }),
      invalidatesTags: ["Auctions"],
    }),

    updateAuction: builder.mutation({
      query: (data) => ({
        url: `${AUCTION_URL}/${data.auctionId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auctions","User"],
    }),
    
    uploadAuctionImage: builder.mutation({ 
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteAuction: builder.mutation({
      query: (auctionId) => ({
        url: `${AUCTION_URL}/${auctionId}`,
        method: "DELETE",
      }),
      providesTags: ["Auctions"],
    }),

   
  }),
});

export const {
    useGetAuctionsQuery, 
    useGetAuctionByIdQuery, 
    useCreateAuctionMutation,
    useUpdateAuctionMutation,
    useUploadAuctionImageMutation, 
    useDeleteAuctionMutation
} = auctionApiSlice;