import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import SubmitForm from "./SubmitForm";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; //récupération de l'url
import Link from "next/link";

function Home() {
  const router = useRouter();

  const [factsData, setFactsData] = useState([]);

  // fonction d'upload de toutes les photos 
  async function getFacts() {
    let response;
    let data;
    if (router.query.type) {
      response = await fetch(
        //`http://localhost:3000/facts/${router.query.type}`
        `https://useless-true-stuff-backend.vercel.app/facts/${router.query.type}`
      );
      data = await response.json();
    } else {
      response = await fetch(
        //`http://localhost:3000/facts/`
        `https://useless-true-stuff-backend.vercel.app/facts/`
      );
      data = await response.json();
    }

    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        nbVotesPlus: fact.votePlus,
        nbVotesMinus: fact.voteMinus,
        factComments: fact.comments,
        factImage: fact.image,
        factId: fact._id,
      };
      return newFactFormat;
    });
    setFactsData(newFactsData);
  }

  useEffect(() => {
    getFacts();
  }, [router.query]);

  let facts = factsData.map((data, i) => {
    return (
      <Fact
        key={i}
        {...data}
        //factTitle={`${data.factId} ${data.factTitle}`}
        factImage={`https://picsum.photos/200/200?random=${i}`}
      />
    );
  });

  return (
    <div>
      <Head>
        <title>Useless True Stuff - Home</title>
      </Head>

      <div className={styles.mainContainer}>
        <div className={styles.mainPublicity}></div>
        <div className={styles.factsContainer}>{facts}</div>
        <div className={styles.mainPublicity}></div>
      </div>
    </div>
  );
}

export default Home;
