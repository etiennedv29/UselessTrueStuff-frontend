import styles from "../styles/CommentSmall.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import moment from 'moment'
import "moment/locale/fr";

function Comment(props) {
  moment.locale("fr")

  console.log("commentSmall props", props)
  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentHeader}>
            <span className= {styles.commentAuthor}>Commenté par {props.author.username} &nbsp;</span><span className={styles.commentSubmissionDate}> le {moment(props.submittedAt).format("Do MMMM YYYY")}</span>

      </div>
      <div className={styles.commentContent}>
        {props.text}
      </div>
    </div>
  );
}

export default Comment;
