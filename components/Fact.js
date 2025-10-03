import styles from "../styles/Fact.module.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CommentSmall from "./CommentSmall";
import Login from "./Login";
import Modal from "antd/lib/modal";
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

  // Vérifier si has voted or not pour plus et moins
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
    // si user pas connecté (pas d'accessToken en mémoire) -> modal de connexion qui s'affiche
    if (!currentUser?.accessToken) {
      changeModalState();
      return;
    }
  
    // Update en front du vote avec condition sur le currentuser a déjà voté ou pas
    if (!hasVotedPlus) {
      setNbVotesPlus(nbVotesPlus + 1);
      dispatch(addUserVote({ voteType: "votePlus", factId: props.factId }));
    } else {
      console.log("user has already voted plus and reclicks");
      setNbVotesPlus(nbVotesPlus - 1);
      dispatch(removeUserVote({ voteType: "votePlus", factId: props.factId }));
    }
    setHasVotedPlus(!hasVotedPlus);
  
    try {
      // Update en base de donnée du vote (avec apiFetch → gère le token/refresh automatiquement)
      const votePlusResponse = await apiFetch("/facts/modifyLikes", {
        method: "POST",
        body: JSON.stringify({
          factId: props.factId,
          voteType: "votePlus",
          userId: currentUser._id,
        }),
      });
  
      console.log("votePlus confirmed", votePlusResponse);
    } catch (err) {
      console.error("Erreur lors du votePlus :", err);
    }
  };
  
  const voteMinusClick = async () => {
    // si user pas connecté (pas d'accessToken en mémoire) -> modal de connexion qui s'affiche
    if (!currentUser?.accessToken) {
      changeModalState();
      return;
    }
  
    // Ajout condition de "has already voted"
    if (!hasVotedMinus) {
      setNbVotesMinus(nbVotesMinus - 1);
      dispatch(addUserVote({ voteType: "voteMinus", factId: props.factId }));
    } else {
      setNbVotesMinus(nbVotesMinus + 1);
      dispatch(removeUserVote({ voteType: "voteMinus", factId: props.factId }));
    }
    setHasVotedMinus(!hasVotedMinus);
  
    try {
      // Update en base via apiFetch (gère token + refresh)
      const voteMinusResponse = await apiFetch("/facts/modifyLikes", {
        method: "POST",
        body: JSON.stringify({
          factId: props.factId,
          voteType: "voteMinus",
          userId: currentUser._id,
        }),
      });
  
      console.log("voteMinus confirmed", voteMinusResponse);
    } catch (err) {
      console.error("Erreur lors du voteMinus :", err);
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
    <div className="flex flex-col justify-center items-center gap-1">
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
      <div className="w-full h-full max-h-96 flex justify-between items-center p-3 rounded-md bg-sky-50 gap-3">
        <div className="hidden sm:flex justify-center w-1/5 ">
          <img
            className="w-full h-full object-contain rounded-md"
            src={props.factImage}
            alt="This fact image"
          />
        </div>

        <div className="w-full sm:w-4/5 h-full flex flex-col justify-between gap-3">
          <div className="w-full h-full flex flex-col justify-start">
            <div className="">
              <Link
                href={`/facts/${props.factId}`}
                className="decoration-non cursor-pointer"
              >
                <h2 className="flex items-center cursor-pointer font-bold text-base ">
                  {props.factTitle}
                </h2>
              </Link>

              <div className="text-xs ">
                Proposé par {props.factAuthor?.username} le{" "}
                {props.factSubmittedAt.slice(0, 10)}
              </div>
            </div>
            <div className="h-0 w-full border-[0.5px] border-[#0b0c1a]"></div>
            <Link
              href={`/facts/${props.factId}`}
              className="decoration-none cursor-pointer "
            >
              <div className="h-full pt-1 cursor-pointer break-normal wrap-break-word ">
                {props.factDescription}
              </div>
            </Link>
          </div>
          <div className="h-1/5 flex justify-center sm:justify-end items-center gap-1">
            <div
              className="flex flex-row justify-center text-center items-center w-auto p-0.5 h-full sm:h-4/5 bg-[#1ad4ff] rounded-sm cursor-pointer"
              onClick={() => handleCommentDisplayClick()}
            >
              <span className="text-xs sm:text-md">
                {props.factComments?.length} commentaire
                {props.factComments?.length > 1 && "s"}
              </span>
            </div>

            <div
              className="flex flex-row justify-between w-[33%] sm:w-[25%] h-full sm:h-4/5 items-center border-[#0b0c1a] border-1 pl-1 rounded-md text-xs cursor-pointer"
              onClick={() => votePlusClick()}
            >
              <div className="text-xs sm:text-md object-contain">
                Top info !
              </div>
              <div className={`w-2/5 h-full flex flex-row justify-center rounded-r-md items-center ${hasVotedPlus ? "bg-emerald-400" : "bg-[#1ad4ff]"}`}>
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="w-2/5 sm:w-[30%] "
                />
                <span className="ml-1 text-xs sm:text-md">{nbVotesPlus}</span>
              </div>
            </div>

            <div
              className="flex flex-row justify-between w-[33%] sm:w-[25%] h-full sm:h-4/5 items-center border-[#0b0c1a] border-1 pl-1 rounded-md text-xs cursor-pointer"
              onClick={() => voteMinusClick()}
            >
              <div className="text-xs sm:text-md object-contain ">Inutile</div>
              <div className={`w-2/5 h-full flex flex-row justify-center rounded-r-md items-center 
    ${hasVotedMinus ? "bg-red-400" : "bg-[#1ad4ff]"}`}>
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  className="w-2/5 sm:w-[30%]"
                />
                <span className="ml-1 text-xs sm:text-md">{nbVotesMinus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center ">
        <div className="w-full flex flex-col items-center justify-center ">
          {displayComments && commentsToDisplay}
        </div>
        {displayComments && (
          <Link
            href={`/facts/${props.factId}`}
            className="decoration-none cursor-pointer"
          >
            <div className="text-center cursor-pointer w-full bg-[#1ad4ff] rounded-md py-1 px-3 mb-3 text-sm sm:text-md ">
              Voir plus de commentaires
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Fact;
