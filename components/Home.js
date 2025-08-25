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
      console.log("router.query.type existait")
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search?tags=${router.query.type}`
      );
      data = await response.json();
    } else {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search`
      );
      data = await response.json();
    }

    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        factAuthor:fact.userID,
        factSubmittedAt:fact.submittedAt,
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
      />
    );
  });

  return (
    <div>
      <Head>
        <title>UselessTrueStuff - Home</title>
      </Head>

      <div className={styles.mainContainer}>
        <div  class = "w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
        <div class = "w-full m:w-3/5 p-5 flex flex-col justify-center" >{facts}</div>
        <div class = "w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
      </div>
    </div>
  );
}

export default Home;
