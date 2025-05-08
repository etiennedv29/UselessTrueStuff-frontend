import styles from "../styles/CommentSmall.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import moment from 'moment'

function Comment(props) {
  console.log(props)
  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
            <span className= {styles.commentAuthor}>Submitted by {props.author}  </span><span className={styles.commentSubmissionDate}> on {moment(props.submittedAt).format("Do [of] MMMM YYYY")}</span>
      </div>
      <div className={styles.commentContent}>
        {props.text}
      </div>
    </div>
  );
}

export default Comment;
