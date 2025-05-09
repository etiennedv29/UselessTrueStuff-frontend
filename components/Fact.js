import styles from "../styles/Fact.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CommentSmall from "./CommentSmall";
import SubmitFormComment from "./SubmitFormComment";

function Fact(props) {
  const [nbVotesPlus, setNbVotesPlus] = useState(props.nbVotesPlus);
  const [nbVotesMinus, setNbVotesMinus] = useState(props.nbVotesMinus);
  const [displayComments, setDisplayComments] = useState(false);
  const [commentsToDisplay, setCommentsTodisplay] = useState([]);

  const votePlusClick = () => {
    setNbVotesPlus(nbVotesPlus + 1);
  };
  const voteMinusClick = () => {
    setNbVotesMinus(nbVotesMinus - 1);
  };

  //prepare the comments to be displayed
  useEffect(() => {
    setCommentsTodisplay(
      props.factComments.slice(0, 3).map((data, i) => {
        return <CommentSmall {...data} key={i} />;
      })
    );
  }, [displayComments]);

  const handleCommentDisplayClick = () => {
    setDisplayComments(displayComments === true ? false : true);
  };

  return (
    <div className={styles.factIncludingComments}>
      <div className={styles.factBox}>
        <div className={styles.factImageContainer}>
          <img
            className={styles.factImage}
            src="https://picsum.photos/200"
            alt="This fact image "
          />
        </div>

        <div className={styles.factInfoContainer}>
          <h2 className={styles.factTitle}>{props.factTitle}</h2>
          <div className={styles.factSeparator}></div>
          <div className={styles.factDescription}>{props.factDescription}</div>

          <div className={styles.factSocialContainer}>
            <div
              className={styles.commentsContainer}
              onClick={() => handleCommentDisplayClick()}
            >
              <span className={styles.commentCount}>
                {props.factComments.length} comments
                {/* <SubmitFormComment factId={props.factId} /> */}
              </span>
            </div>

            <div
              className={styles.votesContainer}
              onClick={() => votePlusClick()}
            >
              <div className={styles.voteText}>Great info!</div>
              <div className={styles.votesBox}>
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className={styles.voteThumb}
                />
                <span className={styles.votesCount}>{nbVotesPlus}</span>
              </div>
            </div>

            <div
              className={styles.votesContainer}
              onClick={() => voteMinusClick()}
            >
              <div className={styles.voteText}>Too useless</div>
              <div className={styles.votesBox}>
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className={styles.voteThumb}
                />
                <span className={styles.votesCount}>{nbVotesMinus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.commentsModal}>
        <div className={styles.commentsBox}>
          {displayComments && commentsToDisplay}
        </div>
        {displayComments && (
          <div className={styles.seeMoreCommentsButton}> See more comments</div>
        )}
      </div>
    </div>
  );
}

export default Fact;
