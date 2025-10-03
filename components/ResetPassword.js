import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "../utils/apiFetch";

function ForgotPassword({ changeVisibleModal }) {
  const searchParams = useSearchParams();
  const tokenResetPassword = searchParams.get("token");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const differentPasswords = "Les 2 mots de passe doivent être identiques";
  const incorrectRulesPasswordError =
    "Le mot de passe doit contenir 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère parmi #@$!%*?& et être d'au moins 8 caractères";
  const missingFieldsErrorMessage = "Les 2 champs doivent être renseignés";
  const expiredTokenErrorMessage =
    "Le lien de réinitialisation a expiré, tu peux recommencer stp ?";

  //password conditions
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/;

  async function handleForgotPasswordSubmit(password1, password2) {
    // cas champ manquant
    if (!password1 || !password2) {
      setErrorMessage(missingFieldsErrorMessage);
      return;
    }
    // cas les 2 mdp sont différents
    if (password1 !== password2) {
      setErrorMessage(differentPasswords);
      return;
    }

    //le mot de passe1 ne satisfait pas toutes les conditions
    if (!passwordRegex.test(password1)) {
      setErrorMessage(incorrectRulesPasswordError);
      return;
    }

    // appel API avec apiFetch
    try {
      const data = await apiFetch("/users/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenResetPassword,
          newPassword: password1,
        }),
      });
      setErrorMessage(data.message); // success message renvoyé par le back
    } catch (err) {
      // gestion des erreurs spécifiques
      if (err.message.includes("401")) {
        setErrorMessage(expiredTokenErrorMessage);
      } else {
        setErrorMessage("Internal Server Error");
      }
    }
  }

  return (
    <div className="pt-10 pb-10 bg-[#0b0c1a] text-[#1ad4ff] w-full h-auto text-base sm:text-xl text-center flex flex-col gap-4">
      <h2> Allez, choisis un nouveau mot de passe</h2>
      <div className="flex flex-col gap-1 justify-center items-center text-center">
        <input
          className="w-3/5 sm:w-[30%] h-10 rounded-md bg-white text-xs sm:text-sm text-gray-700 pl-2"
          type="password"
          placeholder="Nouveau mot de passe"
          id="resetPassword1"
          onChange={(e) => {
            setPassword1(e.target.value);
            setErrorMessage("");
          }}
          value={password1}
        />
        <p
          className={`pl-9 text-left text-xs sm:text-sm w-4/5 sm:w-2/5 mb-2 ${
            password1.length < 8
              ? "text-[#1ad4ff]"
              : passwordRegex.test(password1)
              ? "text-[#A7D8A2]"
              : "text-[lightcoral]"
          }`}
        >
          {incorrectRulesPasswordError}
        </p>
        <input
          className="w-3/5 sm:w-[30%] h-10 rounded-md bg-white text-xs sm:text-sm text-gray-700 pl-2 "
          type="password"
          placeholder="Confirme le nouveau mot de passe"
          id="resetPassword2"
          onChange={(e) => {
            setPassword2(e.target.value);
            setErrorMessage("");
          }}
          value={password2}
        />
        <p className="pt-4 text-xs sm:text-sm text-red-300 "> {errorMessage}</p>
        <button
          className="bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] items-center hover:text-[#1ad4ff] border-1 border-[#1ad4ff] my-5 font-bold w-2/5 sm:w-[20%] h-10 rounded-md cursor-pointer "
          id="forgotPasswordButton"
          onClick={() => handleForgotPasswordSubmit(password1, password2)}
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
