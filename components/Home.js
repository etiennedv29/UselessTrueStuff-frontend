import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import SubmitForm from './SubmitForm'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";

function Home() {
  const [factsData, setFactsData] = useState([]);

  async function getFacts() {
    let response = await fetch(
      `https://useless-true-stuff-backend.vercel.app/facts/`
    );
    let data = await response.json();

    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        nbVotesPlus: fact.votePlus,
        nbVotesMinus: fact.voteMinus,
        factComments: fact.comments,
        factImage: fact.image,
      };
      return newFactFormat;
    });
    setFactsData(newFactsData);
  }

  useEffect(() => {
    getFacts();
  }, []);

  let facts = factsData.map((data, i) => {
    return <Fact key={i} {...data} />;
  });

  return (
    <div>
      <Head>
        <title>Useless True Stuff - Home</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.globalInfo}>
          <div className={styles.logoContainer}>
            <Image
              className={styles.logoImage}
              src="/uselessTrueStuff_logo.jpg"
              alt="UselessTrueStuff logo"
              width={133}
              height={100}
            />
            <div className={styles.logoCatchPhrase}>
              True stuff you didn't know you needed
            </div>
          </div>
          <div className={styles.userInfoContainer}>
            <FontAwesomeIcon
              icon={faUser}
              className={styles.userImage}
              style={{ color: "#1ad4ff" }}
            />
            <div className={styles.userName}>Etienne</div>
          </div>
        </div>
        <navbar className={styles.navbar}>
          <div className={styles.navbarCategories}>
            <div className={styles.navbarCategory}>Catégorie 1</div>
            <div className={styles.navbarCategory}>Catégorie 2</div>
            <div className={styles.navbarCategory}>Catégorie 3</div>
            <div className={styles.navbarCategory}>Catégorie 4</div>
          </div>
          <div className={styles.navBarSubmitFact}>
            <SubmitForm />
          </div>
        </navbar>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.mainPublicity}></div>
        <div className={styles.factsContainer}>{facts}</div>
        <div className={styles.mainPublicity}></div>
      </div>
    </div>
  );
}

export default Home;
