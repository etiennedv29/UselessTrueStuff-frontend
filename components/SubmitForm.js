import { useState, useEffect } from "react";
//import styles from "../styles/Home.module.css";
import styles from "../styles/SubmitForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { apiFetch } from "../utils/apiFetch";

function SubmitForm(props) {
  const [formData, setFormData] = useState({
    userID: "",
    title: "",
    description: "",
    category: "",
  });
  const user = useSelector((state) => state.users.value);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fact = {
      ...formData,
      votePlus: 0,
      voteMinus: 0,
      comments: [],
      submittedAt: new Date(),
      validatedAt: null,
      trueRatio: null,
      status: "pending",
      image: "",
      userID: user._id,
    };
    console.log("fact before POST request", fact);

    try {
      const addedFact = await apiFetch("/facts/addFact", {
        method: "POST",
        body: JSON.stringify(fact),
      });
     
      console.log("added fact =>", addedFact?.description?.slice(0, 30));

      message.success("Merci pour cette info ! On la vérifie vite fait");
      // on réinitialise le formulaire
      setFormData(Object.fromEntries(Object.keys(formData).map(key => [key, ""])));

      //on ferme la modale
      props.changeVisibleModal();

      //on n'appelle plus checkFacts car la verif se fait en back
    } catch (error) {
      console.error("Fact check failed", error);
    }
  };

  return (
    <div className="z-1000 flex justify-center items-center w-full h-full ">
      <div className=" bg-[#0b0c1a] p-5 w-[500px] h-auto border-[#1ad4ff] border-1 rounded-xl relative shadow-[0_2px_10px_rgba(0,0,0,0.1)] ">
        <h2 className="text-[#1ad4ff] text-center text-sm sm:text-lg font-bold mb-2">
          Super ! Une info inutile et sûrement vraie
        </h2>
        <form
          className="flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col justify-center w-full">
            <input
              className="w-full p-2 rounded-xs mb-2 text-white text-xs sm:text-sm border-[#1ad4ff] border-1"
              type="text"
              name="title"
              placeholder="Titre de ton info (entre 10 et 30 caractères)"
              value={formData.title}
              onChange={handleChange}
              minLength="10"
              maxLength="30"
              required
            />
            <textarea
              className="p-2 border-1 border-[#1ad4ff] rounded-xs mb-2 text-white text-xs sm:text-sm"
              name="description"
              placeholder="Dis-nous tout : quelle est ton info vraie et pas très utile ?"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ height: "150px" }}
            />
          </div>

          <button
            className="p-2 rounded-md bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] hover:text-[#1ad4ff] cursor-pointer mt-4 text-sm sm:text-lg font-bold w-4/5 border-1 border-[#0b0c1a] hover:border-[#1ad4ff]"
            type="submit"
          >
            Proposer cette info
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitForm;
