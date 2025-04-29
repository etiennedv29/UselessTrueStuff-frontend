import styles from "../styles/Fact.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';


function Fact(props) {
  
  const [nbVotesPlus, setNbVotesPlus] = useState(props.nbVotesPlus);
  const [nbVotesMinus, setNbVotesMinus] = useState(props.nbVotesMinus);

  const votePlusClick= () => {
    setNbVotesPlus(nbVotesPlus+1)
  }
  const voteMinusClick= () => {
    setNbVotesMinus(nbVotesMinus-1)
  }
  

  return (
    <div className={styles.factBox}>
      <div className={styles.factImageContainer}>
        <img className={styles.factImage} src="https://picsum.photos/200" alt="This fact image " />
      </div>
  
      <div className={styles.factInfoContainer}>
        <h2 className={styles.factTitle}>{props.factTitle}</h2>
        <div className = {styles.factSeparator}></div>
        <div className={styles.factDescription}>{props.factDescription}</div>
  
        <div className={styles.factSocialContainer}>
  
          <div className={styles.commentsContainer}>
            <span className={styles.commentCount}>{props.factComments.length} comments</span>
          </div>
  
          <div className={styles.votesContainer} onClick={()=> votePlusClick()}>
          <div className={styles.voteText}>Great info!</div>
            <div className={styles.votesBox} >
              <FontAwesomeIcon icon={faThumbsUp} /> 
              <span className={styles.votesCount}>{nbVotesPlus}</span>
            </div>
            
          </div>
  
          <div className={styles.votesContainer} onClick={()=> voteMinusClick()}>
          <div className={styles.voteText}>Too useless</div>
            <div className={styles.votesBox} >
              <FontAwesomeIcon icon={faThumbsDown}/>
              <span className={styles.votesCount}>{nbVotesMinus}</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Fact;
