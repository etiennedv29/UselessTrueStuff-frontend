import '../styles/globals.css';
import Head from 'next/head';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Useless True Stuff</title>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8211374496683215"
     crossorigin="anonymous"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
