import styles from "../styles/Fact.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";


function Fact(props) {
  const [nbVotesPlus, setNbVotesPlus] = useState(0);
  const [nbVotesMinus, setNbVotesMinus] = useState(0);

  const votePlusClick= () => {
    setNbVotesPlus(nbVotesPlus+1)
  }
  const voteMinusClick= () => {
    setNbVotesMinus(nbVotesMinus-1)
  }
  

  return (
    <div className={styles.factBox}>
      <div className={styles.factImageContainer}>
        <img className={styles.factImage} src="./fact-default-image.jpg" alt="a" />
      </div>
  
      <div className={styles.factInfoContainer}>
        <div className={styles.factTitle}>Stepping to the top</div>
        <div className = {styles.factSeparator}></div>
        <div className={styles.factDescription}>There are 10000 steps to get up the Eiffel Tower</div>
  
        <div className={styles.factSocialContainer}>
  
          <div className={styles.commentsContainer}>
            <span className={styles.commentCount}>34 comments</span>
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
