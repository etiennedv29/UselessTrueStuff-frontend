import styles from "../styles/Fact.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CommentSmall from "./CommentSmall";
import SubmitFormComment from "./SubmitFormComment";
import { useRouter } from "next/router";

function SingleFactDetails(props) {
const router = useRouter()
  

  //prepare the comments to be displayed
//   useEffect(() => {
//     setCommentsTodisplay(
//       props.factComments.slice(0, 3).map((data, i) => {
//         return <CommentSmall {...data} key={i} />;
//       })
//     );
//   }, [displayComments]);



  return (
    <div>
        <div className = {styles.singleCommentLeftSide}>
            
        </div>
        
        <div className = {styles.singleCommentRightSide}></div>
        
      <div>fact page</div>
      <div> {router.query.fact}</div>
    </div>
    
  );
}

export default SingleFactDetails;
