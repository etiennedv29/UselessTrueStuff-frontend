import styles from "../styles/Fact.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Comment(props) {
  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
            <span className= {styles.author}>Submitted by {props.author}</span><span className={styles.submissionDate}> on {props.submittedAt}</span>
      </div>
      <div className={styles.commentContent}>
        {props.description}
      </div>
    </div>
  );
}

export default Comment;
