import styles from "../styles/Fact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CommentSmall from "./CommentSmall";
import SubmitFormComment from "./SubmitFormComment";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Fact from "./Fact";

function SingleFactDetails(props) {
  const router = useRouter();
  const pageFactId = router.query.fact;
  console.log({ pageFactId });
  const [factDetails, setfactDetails] = useState({});
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);

  const getFactInfo = async (factId) => {
    console.log("into getfactinfo", factId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search?factId=${factId}`
      );
      if (!res.ok) {
        throw new Error(
          `Erreur HTTP ${res.status} lors de la récupération du fait`
        );
      }
      const data = await res.json();
      const fact = data[0];
      const factData = {
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

      setfactDetails(factData);
      return data;
    } catch (error) {
      console.error("Erreur dans getFactInfo :", error);
      return null;
    }
  };

  useEffect(() => {
    getFactInfo(pageFactId);
  }, []);

  //prepare the comments to be displayed
  //   useEffect(() => {
  //     setCommentsTodisplay(
  //       props.factComments.slice(0, 3).map((data, i) => {
  //         return <CommentSmall {...data} key={i} />;
  //       })
  //     );
  //   }, [displayComments]);
  console.log({ factDetails });
  return (
    <>
      <div>{router.query.factId}</div>
      <Fact {...factDetails} />
    </>
  );
}

export default SingleFactDetails;
