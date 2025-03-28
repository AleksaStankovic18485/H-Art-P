import {configureStore} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {apiSlice} from "./api/apiSlice";
import loginReducer from './features/login/loginSlice'
 

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        login:loginReducer
    },

    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true

})

setupListeners(store.dispatch);
export default store;