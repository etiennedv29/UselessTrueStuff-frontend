import styles from "../styles/singleFactPage.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { users } from "../reducers/users";
import Fact from "./Fact";
import Head from "next/head";
import Login from "./Login";
import Modal from "antd/lib/modal";

function SingleFact(props) {
  const router = useRouter();
  const [factsData, setFactsData] = useState([]);
  const [commentText, setCommentText] = useState("");

  const user = useSelector((state) => state.users.value);


  async function getFacts() {
    let response;
    let data;

    if (router.query.fact) {
      console.log("router.query.fact existait");
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search?factId=${router.query.fact}`
      );
      data = await response.json();
    } else {
      router.push("/")
    }

    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        factAuthor: fact.userID,
        factSubmittedAt: fact.submittedAt,
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
    return <Fact key={i} {...data} />;
  });

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    console.log("handle submit");
    e.preventDefault();

    const comment = {
      author: user._id,
      text: commentText,
      submittedAt: new Date(),
      factId: router.query.fact,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/comments/addComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedComment = await response.json();
      console.log("addedComment = ", addedComment)
      alert("Comment submitted! Thanks");
      setCommentText("")
    } catch (error) {
      console.error("Submission failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Head>
        <title>Useless True Stuff - Home</title>
      </Head>

      <div className={styles.mainContainer}>
        <div className={styles.mainPublicity}></div>
        <div className={styles.globalFactContainer}>
          <div className={styles.factsContainer}>{facts}</div>
          <div className={styles.addCommentContainer}>
            <div className={styles.addCommentTitle}>
              Tu réponds quoi à cette info ?
            </div>
            <textarea
              id="commentText"
              className={styles.addCommentDescription}
              name="description"
              placeholder="Vas-y lâche-toi ! Sache quand même que ça sera modéré si besoin"
              value={commentText}
              onChange={handleChange}
            ></textarea>

            <div
              className={styles.addCommentBtn}
              onClick={(e) => {
                handleCommentSubmit(e);
              }}
            >
              Ajouter le commentaire
            </div>
          </div>
        </div>
        <div className={styles.mainPublicity}></div>
      </div>
    </div>
  );
}

export default SingleFact;
