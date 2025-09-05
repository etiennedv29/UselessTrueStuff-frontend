import { useState } from "react";

function ForgotPassword({ changeVisibleModal }) {
  const [email, setEmail] = useState("");
  const [forgottenPasswordErrorMessage, setForgottenPasswordErrorMessage] =
    useState("");

  //Forgot password functionnality
  async function handleForgotPasswordSubmit(email) {
    console.log("envoi email au back");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/users/forgotPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForgottenPasswordErrorMessage(data.message);
    } catch (err) {
      setForgottenPasswordErrorMessage(err.message);
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
