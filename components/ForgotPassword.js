import { useState } from "react";
import { message } from "antd";
import { apiFetch } from "../utils/apiFetch";

function ForgotPassword({ changeVisibleModal }) {
  const [email, setEmail] = useState("");
  const [forgottenPasswordErrorMessage, setForgottenPasswordErrorMessage] =
    useState("");

  // Forgot password functionnality
  async function handleForgotPasswordSubmit(email) {
    console.log("envoi email au back");

    try {
      const res = await apiFetch("/users/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // route publique → pas besoin d'accessToken
        body: JSON.stringify({ email }),
      });

      // Si on arrive ici, la requête est 200
      message.success("Email envoyé, vérifie ta boîte mail !");
      setForgottenPasswordErrorMessage("");
    } catch (err) {
      if (err.status === 401) {
        // enregistré avec un social login → message du back
        setForgottenPasswordErrorMessage(
          err.message || "Compte social login détecté"
        );
      } else {
        console.error("Erreur forgotPassword =", err);
        setForgottenPasswordErrorMessage("Internal Server Error");
      }
    }
  }

  return (
    <div className="text-[#1ad4ff] w-full h-full flex flex-row justify-around items-start bg-[#0b0c1a] rounded-md pb-8 border-1 border-[#1ad4ff]">
      <div className="flex flex-col justify-center items-center w-full rounded-lg">
        <h2 className="text-center text-xl font-bold mb-5">
          Mot de passe oublié ?
        </h2>
        <p className="text-center mb-2">
          No souci, donne ton email, on va régler ça
        </p>
        <div className="flex flex-col justify-between text-center items-center w-full gap-2 mb-2">
          <input
            className="w-4/5 sm:w-3/5 h-10 rounded-md bg-white text-base pl-5"
            type="text"
            placeholder="Ton email"
            id="forgotPasswordEmail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            minLength={4}
          />
          <p className="text w-auto h-auto text-red-300">
            {forgottenPasswordErrorMessage}
          </p>
          <button
            className="bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] items-center hover:text-[#1ad4ff] border-1 border-[#1ad4ff] my-5 font-bold w-[40%] sm:w-2/5 h-auto rounded-md cursor-pointer "
            id="forgotPasswordButton"
            onClick={() => handleForgotPasswordSubmit(email)}
          >
            Réinitialiser ton mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
