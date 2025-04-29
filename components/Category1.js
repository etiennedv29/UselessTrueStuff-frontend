import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import Header from "./Header"
import SubmitForm from './SubmitForm'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from 'next/link';

function Category1() {
    const [factsData, setFactsData] = useState([]);
  
    async function getFacts() {
      let response = await fetch(
        //`http://localhost:3000/facts/:geography`
        `https://useless-true-stuff-backend.vercel.app/facts/scientifique`
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
      return <Fact key={i} {...data} factTitle={`${i} ${data.factTitle}`} factImage={`https://picsum.photos/200/200?random=${i}`} />;
    });
  
    return (
      <div>
        <Head>
          <title>Useless True Stuff - Home</title>
        </Head>
        <Header />
  
        <div className={styles.mainContainer}>
          <div className={styles.mainPublicity}></div>
          <div className={styles.factsContainer}>{facts}</div>
          <div className={styles.mainPublicity}></div>
        </div>
      </div>
    );
  }
  
  export default Category1;
  