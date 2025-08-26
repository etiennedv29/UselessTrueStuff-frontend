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
        <title>Useless True Stuff - Passionnant</title>
      </Head>

      <div class ="w-full flex flex-row justify-between bg-[#0b0c1a] ">
        <div class = "w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
        <div class="flex flex-col justify-center items-center">
          <div class="w-full flex flex-col justify-center p-4 h-full">{facts}</div>
          <div class="w-full flex flex-col justify-center items-center gap-1 mb-2">
            <div class="w-full text-center text-[#1ad4ff] text-base">
              Tu réponds quoi à cette info ?
            </div>
            <textarea
              id="commentText"
              class="w-4/5 h-30 bg-white rounded-md pl-5 pt-1"
              name="description"
              placeholder="Vas-y lâche-toi ! Sache quand même que ça sera modéré si besoin"
              value={commentText}
              onChange={handleChange}
            ></textarea>

            <div
              class="bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] hover:text-[#1ad4ff] h-auto font-bold rounded-sm cursor-pointer flex text-align items-center justify-center py-2 px-5 text-base sm:text-lg"
              onClick={(e) => {
                handleCommentSubmit(e);
              }}
            >
              Ajouter le commentaire
            </div>
          </div>
        </div>
        <div class = "w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
      </div>
    </div>
  );
}

export default SingleFact;
