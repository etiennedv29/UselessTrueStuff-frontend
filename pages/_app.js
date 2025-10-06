import "../styles/globals.css";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";

function App({ Component, pageProps }) {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Head>
              {/* --- Base meta tags --- */}
              <meta charSet="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <meta
                name="description"
                content="Découvrez des faits originaux, vérifiés et amusants. C'est fun et tout a été contrôlé pour être vrai !"
              />
              <meta name="robots" content="index, follow" />
              <link rel="canonical" href="https://www.uselesstruestuff.info/" />

              {/* --- SEO / Branding --- */}
              <title>UselessTrueStuff - Des faits originaux et fascinants</title>
              <meta name="author" content="UselessTrueStuff" />
              <meta name="google-adsense-account" content="ca-pub-8211374496683215" />

              {/* --- Open Graph / Facebook --- */}
              <meta property="og:type" content="website" />
              <meta property="og:locale" content="fr_FR" />
              <meta property="og:title" content="UselessTrueStuff - Faits originaux et intéressants" />
              <meta property="og:description" content="Des faits originaux, vérifiés et amusants. Trouvez des curiosités surprenantes qui égayeront vos journées." />
              <meta property="og:url" content="https://www.uselesstruestuff.info" />
              <meta property="og:image" content="/uselessTrueStuff_logo.jpg" />

              {/* --- Twitter Cards --- */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="UselessTrueStuff - Faits originaux et intéressants" />
              <meta name="twitter:description" content="Des faits originaux, vérifiés et amusants. Trouvez des curiosités surprenantes qui égayeront vos journées." />
              <meta name="twitter:image" content="/uselessTrueStuff_logo.jpg" />

              {/* --- Favicons & PWA --- */}
              <link
                rel="icon"
                type="image/png"
                sizes="96x96"
                href="/uselessTrueStuff_favicon/favicon-96x96.png"
              />
              <link
                rel="icon"
                type="image/svg+xml"
                href="/uselessTrueStuff_favicon/favicon.svg"
              />
              <link
                rel="shortcut icon"
                href="/uselessTrueStuff_favicon/favicon.ico"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/uselessTrueStuff_favicon/apple-touch-icon.png"
              />
              <meta name="apple-mobile-web-app-title" content="UTS" />
              <link
                rel="manifest"
                href="/uselessTrueStuff_favicon/site.webmanifest"
              />
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
