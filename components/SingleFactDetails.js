// import styles from "../styles/Fact.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
// import Link from "next/link";
// import CommentSmall from "./CommentSmall";
// import SubmitFormComment from "./SubmitFormComment";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import Login from "./Login";
// import Modal from "antd/lib/modal";

// function SingleFactDetails(props) {
//   const router = useRouter();
//   const pageFactId = router.query.fact;
//   console.log("pageFactId debut==", pageFactId);
//   const [factDetails, setFactDetails] = useState({});
//   const [visibleModalLogin, setVisibleModalLogin] = useState(false);

//   useEffect(() => {
//     const getFactInfo = async (factId) => {
//       console.log("into getfactinfo", factId);
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search?factId=${factId}`
//         );
//         if (!res.ok) {
//           throw new Error(
//             `Erreur HTTP ${res.status} lors de la récupération du fait`
//           );
//         }
//         const data = await res.json();
//         const fact = data[0];

//         const factData = {
//           factTitle: fact.title,
//           factDescription: fact.description,
//           factAuthor: fact.userID,
//           factSubmittedAt: fact.submittedAt,
//           nbVotesPlus: fact.votePlus,
//           nbVotesMinus: fact.voteMinus,
//           factComments: fact.comments,
//           factImage: fact.image,
//           factId: fact._id,
//         };
//         console.log({ factData });
//         setFactDetails(factData);
//       } catch (error) {
//         console.error("Erreur dans getFactInfo :", error);
//         setFactDetails(null);
//       }
//     };
//     getFactInfo(pageFactId);
//   }, []);

//   //prepare the comments to be displayed
//   useEffect(() => {
//     console.log("useEffect comments");
//     if (factDetails.comments) {
//       setCommentsTodisplay(
//         factDetails?.factComments.map((data, i) => {
//           return <CommentSmall {...data} key={i} />;
//         })
//       );
//     }
//   }, [factDetails]);

//   return (
//     <div className={styles.factIncludingComments}>
//       <Modal
//         getContainer="#react-modals"
//         open={visibleModalLogin}
//         closable={true}
//         footer={null}
//         onCancel={() => setVisibleModalLogin(null)}
//         width={500}
//         className="modal"
//       >
//         {visibleModalLogin && <Login changeVisibleModal={changeModalState} />}
//       </Modal>
//       <div className={styles.factBox}>
//         <div className={styles.factImageContainer}>
//           <img
//             className={styles.factImage}
//             src={factDetails.factImage}
//             alt="This fact image"
//           />
//         </div>

//         <div className={styles.factInfoContainer}>
//           <div className={styles.factHeader}>
//             <Link href={`/facts/${factDetails.factId}`} className={styles.link}>
//               <h2 className={styles.factTitle}>{factDetails.factTitle}</h2>
//             </Link>

//             <div className={styles.factAuthor}>
//               Proposé par {factDetails.factAuthor?.username} le{" "}
//               {factDetails.factSubmittedAt.slice(0, 10)}
//             </div>
//           </div>
//           <div className={styles.factSeparator}></div>
//           <Link href={`/facts/${factDetails.factId}`} className={styles.link}>
//             <div className={styles.factDescription}>
//               {factDetails.factDescription}
//             </div>
//           </Link>

//           <div className={styles.factSocialContainer}>
//             <div
//               className={styles.commentsContainer}
//               onClick={() => handleCommentDisplayClick()}
//             >
//               <span className={styles.commentCount}>
//                 {factDetails.factComments.length} Commentaires
//                 {/* <SubmitFormComment factId={factDetails.factId} /> */}
//               </span>
//             </div>

//             <div
//               className={styles.votesContainer}
//               onClick={() => votePlusClick()}
//             >
//               <div className={styles.voteText}>Top info !</div>
//               <div className={styles.votesBox}>
//                 <FontAwesomeIcon
//                   icon={faThumbsUp}
//                   className={styles.voteThumb}
//                 />
//                 <span className={styles.votesCount}>{nbVotesPlus}</span>
//               </div>
//             </div>

//             <div
//               className={styles.votesContainer}
//               onClick={() => voteMinusClick()}
//             >
//               <div className={styles.voteText}>Trop inutile</div>
//               <div className={styles.votesBox}>
//                 <FontAwesomeIcon
//                   icon={faThumbsDown}
//                   className={styles.voteThumb}
//                 />
//                 <span className={styles.votesCount}>{nbVotesMinus}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className={styles.commentsModal}>
//         <div className={styles.commentsBox}>
//           {displayComments && commentsToDisplay}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SingleFactDetails;
