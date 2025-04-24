import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image'
import Head from 'next/head'

function Home() {
  let facts = [];
  for (let i = 0; i < 10; i++) {
    facts.push(<Fact key={i} />);
  }
  return (
    <div>
      <Head>
        <title>Useless True Stuff for you</title>
        <meta name="description" content= "Find out super useless facts that have all been verified as true. It's fun yet all very fact-checked!"></meta>
      </Head>
      <header className ={styles.header}>
        <div className={styles.logoContainer}>
          <Image className={styles.logoImage} src="/uselessTrueStuff_logo.jpg" alt="UselessTrueStuff logo" width={133} height={100} />
          <div className = {styles.logoCatchPhrase}>True stuff you didn't know you needed</div>
        </div>
        <div className={styles.userInfoContainer}>
        <FontAwesomeIcon icon={faUser} className={styles.userImage} style={{color:"#1ad4ff"}} />
          <div className={styles.userName}>Etienne</div>
        </div>
      </header>
      <navbar className={styles.navbar}>
        <div className={styles.navbarCategory}>Catégorie 1</div>
        <div className={styles.navbarCategory}>Catégorie 2</div>
        <div className={styles.navbarCategory}>Catégorie 3</div>
        <div className={styles.navbarCategory}>Catégorie 4</div>
      </navbar>
      <div className={styles.mainContainer}>
        <div className={styles.mainPublicity}></div>
        <div className={styles.factsContainer}>{facts}</div>
        <div className={styles.mainPublicity}></div>
      </div>
    </div>
  );
}

export default Home;
