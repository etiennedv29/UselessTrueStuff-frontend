import { useState } from "react";
import { useSelector } from "react-redux";
import Fact from "./Fact";
import Head from "next/head";
import { message } from "antd";
import Login from "./Login";
import Modal from "antd/lib/modal";
import { apiFetch } from "../utils/apiFetch"; // ✅ import apiFetch

function SingleFact(props) {
  const [commentText, setCommentText] = useState("");
  const user = useSelector((state) => state.users.value);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ ajouté : pour éviter le spam d'envoi

  // état de la modal de connexion pour submit un commentaire
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

    // Si user pas connecté, modal de connexion
    if (!user.accessToken) {
      changeModalState();
      return;
    }
    // Empêche double clic pendant l’envoi
    if (isSubmitting) return;

    // Vérifications front
    const trimmedText = commentText.trim();

    if (!trimmedText) {
      message.warning("Ton commentaire est vide !");
      return;
    }

    if (trimmedText.length < 5) {
      message.warning("Ton commentaire doit contenir au moins 5 caractères.");
      return;
    }

    if (trimmedText.length > 500) {
      message.warning("Ton commentaire est trop long (500 caractères max).");
      return;
    }

    const comment = {
      author: user._id,
      text: trimmedText,
      submittedAt: new Date(),
      factId: props.factId,
    };

    setIsSubmitting(true);//bloque un nouveau clic pendant l'exécution de la requête
try {
  const data = await apiFetch("/comments/addComment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });

  console.log("addedComment = ", data);
  message.success("Commentaire envoyé !");
  setCommentText("");
  window.location.reload(); // recharge la page pour rafraîchir les commentaires
} catch (error) {
  console.error("Fail envoi du commentaire", error);

  if (error.status === 400) {
    message.error(
      error?.error || "Ton commentaire n'est pas valide (vide, trop court ou incorrect)."
    );
  } else if (error.status >= 500) {
    message.error("Erreur serveur, réessaie plus tard !");
  } else {
    message.error("Échec de l'envoi du commentaire, réessaie plus tard !");
  }
} finally {
  setIsSubmitting(false);
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
        <title>
          Useless True Stuff - Infos insolites, passionnantes et amusantes
        </title>
      </Head>

      <div className="w-full flex flex-row justify-between bg-[#0b0c1a]">
        <div className="w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>

        <div className="flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-center p-4 h-full">
            {facts}
          </div>

          <div className="w-full flex flex-col justify-center items-center gap-1 mb-2">
            <div className="w-full text-center text-[#1ad4ff] text-base">
              Tu penses quoi de cette info ?
            </div>

            {/* ✅ Textarea avec limite et compteur */}
            <div className="w-4/5 flex flex-col items-end relative">
              <textarea
                id="commentText"
                className="w-full h-30 bg-white rounded-md pl-5 pt-1"
                name="description"
                placeholder="Vas-y, dis ce que ça t'inspire ! (sera modéré si besoin)"
                value={commentText}
                onChange={handleChange}
                maxLength={500} // ✅ limite dure
                disabled={isSubmitting} // ✅ empêche d’écrire pendant envoi
              ></textarea>
              <span className="text-xs text-gray-400 pr-2">
                {commentText.length}/500
              </span>
            </div>

            <div
              className={`bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] hover:text-[#1ad4ff] h-auto font-bold rounded-sm cursor-pointer flex text-align items-center justify-center py-2 px-5 text-base sm:text-lg transition-colors duration-200 ${
                isSubmitting || commentText.trim().length < 5
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={(e) => {
                if (!isSubmitting && commentText.trim().length >= 5) {
                  handleCommentSubmit(e);
                }
              }}
            >
              {isSubmitting ? "Envoi..." : "Ajouter le commentaire"}
            </div>
          </div>
        </div>

        <div className="w-0 md:w-1/10 xl:w-1/5 bg-gray-500"></div>
      </div>
    </div>
  );
}

export default SingleFact;
