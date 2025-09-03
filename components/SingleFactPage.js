import { useState } from "react";
import { useSelector } from "react-redux";
import Fact from "./Fact";
import Head from "next/head";
import { message } from "antd";
import Login from "./Login";
import Modal from "antd/lib/modal";
//note : on passe maintenant par la récupération de props côté serveur avant le chargement de la page pour ne plus dépendre de router.query

function SingleFact(props) {
  const [commentText, setCommentText] = useState("");
  const user = useSelector((state) => state.users.value);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);

  //état de la modal de connexion pour submit un commentaire
  function changeModalState() {
    setVisibleModalLogin(!visibleModalLogin);
  }

  let facts = props.factsData.map((data, i) => {
    return <Fact key={i} {...data} />;
  });

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // si user pas connecté, modal de connexion qui s'affiche
    if (!user.token) {
      changeModalState();
      return;
    }

    const comment = {
      author: user._id,
      text: commentText,
      submittedAt: new Date(),
      factId: props.factId,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/comments/addComment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(comment),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedComment = await response.json();
      console.log("addedComment = ", addedComment);
      //alert("Comment submitted! Thanks");
      message.success("Commentaire envoyé ! ");
      setCommentText("");
    } catch (error) {
      console.error("Fail envoi du commentaire", error);
      //alert("An error occurred. Please try again.");
      message.error("Echec de l'envoi du commentaire, réessaie plus tard !");
    }
  };

  return (
    <div>
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
      <Head>
        <title>Useless True Stuff - Passionnant</title>
      </Head>

      <div className="w-full flex flex-row justify-between bg-[#0b0c1a] ">
        <div className="w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-center p-4 h-full">
            {facts}
          </div>
          <div className="w-full flex flex-col justify-center items-center gap-1 mb-2">
            <div className="w-full text-center text-[#1ad4ff] text-base">
              Tu réponds quoi à cette info ?
            </div>
            <textarea
              id="commentText"
              className="w-4/5 h-30 bg-white rounded-md pl-5 pt-1"
              name="description"
              placeholder="Vas-y lâche-toi ! Sache quand même que ça sera modéré si besoin"
              value={commentText}
              onChange={handleChange}
            ></textarea>

            <div
              className="bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] hover:text-[#1ad4ff] h-auto font-bold rounded-sm cursor-pointer flex text-align items-center justify-center py-2 px-5 text-base sm:text-lg"
              onClick={(e) => {
                handleCommentSubmit(e);
              }}
            >
              Ajouter le commentaire
            </div>
          </div>
        </div>
        <div className="w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
      </div>
    </div>
  );
}

export default SingleFact;
