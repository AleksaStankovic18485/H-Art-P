import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import global_en from "./translations/en/global.json"
import global_rs from "./translations/rs/global.json"
import i18next from "i18next"
import { I18nextProvider } from 'react-i18next'
i18next.init({
  interpolation: {escapeValue:true},
  lng: "en",
  resources:{
    en:{
      global:global_en
    },
    rs:{
      global:global_rs
    }
  }


})


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
    <BrowserRouter>
        <StoreContextProvider >
          <App />
        </StoreContextProvider>
    </BrowserRouter>
    </I18nextProvider>
  </Provider>

)
