import { useState, useEffect } from "react";
//import styles from "../styles/Home.module.css";
import styles from "../styles/SubmitForm.module.css";
import { useDispatch, useSelector } from "react-redux";


function SubmitForm(props) {
  const [formData, setFormData] = useState({
    userID: "",
    title: "",
    description: "",
    category: "",
  });
  const user = useSelector((state) => state.users.value);

  const handleChange = (e) => {
    console.log(e);

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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/addFact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fact),
        }
      );
      const addedFact = await response.json();
      console.log("added fact =>", addedFact);
      console.log("id de l'added fact = ", addedFact._id);

      alert("Fact submitted!");
      setFormData({ userID: "", title: "", description: "", category: "" });
      props.changeVisibleModal();

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/checkFact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: addedFact.description,
            id: addedFact._id,
          }),
        }
      );
    } catch (error) {
      console.error("Submission failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>

        <h2 className={styles.popoverTitle}>
          Super ! Une info inutile et sûrement vraie
        </h2>
        <form className={styles.submitForm} onSubmit={handleSubmit}>
          <div className={styles.formInputsContainer}>
            <input
              className={styles.submitFormField}
              type="text"
              name="title"
              placeholder="Titre de ton info (entre 10 et 30 caractères)"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              className={styles.submitFormField}
              name="description"
              placeholder="Dis-nous tout : quelle est ton info vraie et pas très utile ?"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ height: '150px' }}
            />
          </div>

          <button className={styles.formSubmitButton} type="submit">
            Proposer cette info
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitForm;
