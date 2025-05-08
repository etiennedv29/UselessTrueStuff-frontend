import "../styles/globals.css";
import Head from "next/head";
import Header from '../components/Header'
import Footer from '../components/Footer'

function App({ Component, pageProps }) {
  return (
    <>
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
        <link
          rel="icon"
          href="uselessTrueStuff_logo.jpg"
        ></link>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer/>
    </>
  );
}

export default App;
