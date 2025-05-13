import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

//imports redux
import { Provider } from "react-redux";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import users from "../reducers/users";
import navigations from "../reducers/navigations"
import storage from 'redux-persist/lib/storage';
const reducers = combineReducers({ users,navigations });
const persistConfig = { key: 'UselessTrueStuff', storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
 });
 const persistor = persistStore(store);
 

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <meta
              name="google-adsense-account"
              content="ca-pub-8211374496683215"
            ></meta>
            <meta
              name="description"
              content="Find out super useless facts that have all been verified as true. It's fun yet all very fact-checked!"
            ></meta>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            ></meta>
            <link rel="icon" href="uselessTrueStuff_logo.jpg"></link>
          </Head>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
