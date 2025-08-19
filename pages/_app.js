import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
//imports google connect
import { GoogleOAuthProvider } from "@react-oauth/google";
//imports redux
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import users from "../reducers/users";
import storage from "redux-persist/lib/storage";
const reducers = combineReducers({ users });
const persistConfig = { key: "UselessTrueStuff", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <>
      {/* Charge AdSense globalement (une seule fois) */}
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX"
        crossOrigin="anonymous"
      />
      <GoogleOAuthProvider clientId="501635737631-vhnhpvodr0keh82drk8vstirsi1507hp.apps.googleusercontent.com">
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Head>
              {/* Meta informations pour SEO */}
              <meta
                name="google-adsense-account"
                content="ca-pub-8211374496683215"
              />
              <meta
                name="description"
                content="Découvrez des faits originaux, vérifiés et amusants. C'est fun et tout a été contrôlé pour être vrai !"
              />
              <meta
                name="keywords"
                content="faits originaux, faits intéressants, trivia, curiosités, vérifiés, fun, culture générale, infos"
              />
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
              <meta
                property="og:title"
                content="UselessTrueStuff - Faits originaux et intéressants"
              />
              <meta
                property="og:description"
                content="Des faits originaux, vérifiés et amusants. Trouvez des curiosités surprenantes qui égayeront vos journées."
              />
              <meta property="og:image" content="uselessTrueStuff_logo.jpg" />
              <meta
                property="og:url"
                content="https://www.uselesstruestuff.info"
              />
              <meta name="robots" content="index, follow" />

              <link rel="icon" href="uselessTrueStuff_logo.jpg" />
              <link rel="canonical" href="https://www.uselesstruestuff.info" />
              <title>
                UselessTrueStuff - Des faits originaux et fascinants
              </title>
            </Head>

            <Header />
            <Component {...pageProps} />
            <Footer />
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
