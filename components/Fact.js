import styles from "../styles/Fact.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CommentSmall from "./CommentSmall";
import Login from "./Login";
import Modal from "antd/lib/modal";
import SubmitFormComment from "./SubmitFormComment";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addUserVote, removeUserVote } from "../reducers/users";

function Fact(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [nbVotesPlus, setNbVotesPlus] = useState(props.nbVotesPlus);
  const [nbVotesMinus, setNbVotesMinus] = useState(props.nbVotesMinus);
  const [displayComments, setDisplayComments] = useState(false);
  const [commentsToDisplay, setCommentsTodisplay] = useState([]);
  const [hasVotedPlus, setHasVotedPlus] = useState(false);
  const [hasVotedMinus, setHasVotedMinus] = useState(false);
  const currentUser = useSelector((state) => state.users.value);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);

  //état de la modal de connexion pour submit un vote
  function changeModalState() {
    setVisibleModalLogin(!visibleModalLogin);
  }

  // Vérifier si hasvoted or not pour plus et moins
  useEffect(() => {
    let hasVotedPlusCheck;
    // console.log(currentUser)
    if (currentUser?.votePlus?.some((id) => id.toString() === props.factId)) {
      hasVotedPlusCheck = true;
    } else {
      hasVotedPlusCheck = false;
    }

    let hasVotedMinusCheck;
    if (currentUser?.voteMinus?.some((id) => id.toString() === props.factId)) {
      hasVotedMinusCheck = true;
    } else {
      hasVotedMinusCheck = false;
    }
    setHasVotedPlus(hasVotedPlusCheck);
    setHasVotedMinus(hasVotedMinusCheck);
  }, [hasVotedPlus, hasVotedMinus, currentUser]);

  const votePlusClick = async () => {
    // si user pas connecté, modal de connexion qui s'affiche
    if (!currentUser.token) {
      changeModalState();
      return;
    }

    //Update en front du vote avec condition sur le currentuser a déjà voté ou pas
    if (!hasVotedPlus) {
      setNbVotesPlus(nbVotesPlus + 1);
      dispatch(addUserVote({ voteType: "votePlus", factId: props.factId }));
    } else {
      console.log("user has already voted plus and reclicks");
      setNbVotesPlus(nbVotesPlus - 1);
      dispatch(removeUserVote({ voteType: "votePlus", factId: props.factId }));
    }
    setHasVotedPlus(!hasVotedPlus);

    //Update en base de donnée du vote (verif de déjà voté ou pas en back également)
    const votePlusResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/modifyLikes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          factId: props.factId,
          voteType: "votePlus",
          userId: "681fc5b0d6f664f85733f36c",
        }),
      }
    );
    let dataVotePlusQuery = await votePlusResponse.json();
    if (votePlusResponse.status === 200) {
      console.log("votePlus confirmed");
    }
  };
  const voteMinusClick = async () => {
    // si user pas connecté, modal de connexion qui s'affiche
    if (!currentUser.token) {
      changeModalState();
      return;
    }

    //ajout condition de "has already voted"
    if (!hasVotedMinus) {
      setNbVotesMinus(nbVotesMinus - 1);
      dispatch(addUserVote({ voteType: "voteMinus", factId: props.factId }));
    } else {
      setNbVotesMinus(nbVotesMinus + 1);
      dispatch(removeUserVote({ voteType: "voteMinus", factId: props.factId }));
    }
    setHasVotedMinus(!hasVotedMinus);

    const voteMinusResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/modifyLikes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          factId: props.factId,
          voteType: "voteMinus",
          userId: "681fc5b0d6f664f85733f36c",
        }),
      }
    );
    let dataVoteMinusQuery = await voteMinusResponse.json();
    if (voteMinusResponse.status === 200) {
      console.log("voteMinus confirmed");
    }
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
      <Modal
        getContainer="#react-modals"
        open={visibleModalLogin}
        closable={true}
        footer={null}
        onCancel={() => setVisibleModalLogin(null)}
        width={500}
        className="modal"
      >
        {visibleModalLogin && <Login changeVisibleModal={changeModalState} />}
      </Modal>
      <div className={styles.factBox}>
        <div className={styles.factImageContainer}>
          <img
            className={styles.factImage}
            src={props.factImage}
            alt="This fact image"
          />
        </div>

        <div className={styles.factInfoContainer}>
          <div className={styles.factHeader}>
            <Link href={`/facts/${props.factId}`} className={styles.link}>
              <h2 className={styles.factTitle}>{props.factTitle}</h2>
            </Link>

            <div className={styles.factAuthor}>
              Proposé par {props.factAuthor?.username} le{" "}
              {props.factSubmittedAt.slice(0, 10)}
            </div>
          </div>
          <div className={styles.factSeparator}></div>
          <Link href={`/facts/${props.factId}`} className={styles.link}>
            <div className={styles.factDescription}>
              {props.factDescription}
            </div>
          </Link>

          <div className={styles.factSocialContainer}>
            <div
              className={styles.commentsContainer}
              onClick={() => handleCommentDisplayClick()}
            >
              <span className={styles.commentCount}>
                {props.factComments.length} Commentaires
                {/* <SubmitFormComment factId={props.factId} /> */}
              </span>
            </div>

            <div
              className={styles.votesContainer}
              onClick={() => votePlusClick()}
            >
              <div className={styles.voteText}>Top info !</div>
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
              <div className={styles.voteText}>Trop inutile</div>
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
          <Link href={`/facts/${props.factId}`} className={styles.link}>
            <div className={styles.seeMoreCommentsButton}>
              Voir plus de commentaires
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Fact;
