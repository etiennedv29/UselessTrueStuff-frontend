import { useState, useEffect } from "react";
//import styles from "../styles/Home.module.css";
import styles from "../styles/SubmitForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { rememberOrigin } from "../reducers/navigations";

function SubmitForm(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);

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
    <div>
      <span
        onClick={() => {
          if (!user.token) {
            try {
              dispatch(rememberOrigin(router.pathname));
              router.push("/login");
            } catch (error) {
              console.log("redirection vers login échouée");
            }
          } else {
            setShowForm(true);
          }
        }}
        className={styles.openButton}
      >
        Submit Fact
      </span>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <FontAwesomeIcon
              icon={faSquareXmark}
              className={styles.closeButton}
              onClick={() => setShowForm(false)}
            />

            <h2 className={styles.popoverTitle}>
              Super ! Une info inutile et sûrement vraie
            </h2>
            <form className={styles.submitForm} onSubmit={handleSubmit}>
              <div className={styles.formInputsContainer}>
                <input
                  className={styles.submitFormField}
                  type="text"
                  name="userID"
                  placeholder="Ton nom"
                  value={formData.userID}
                  onChange={handleChange}
                  required
                />
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
                />
                <div className={styles.formCategoryContainer}>
                  <p className={styles.formCategoryText}>Catégorie :</p>
                  <select
                    className={styles.formCategorySelector}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choisir une catégorie</option>
                    <option value="general">Général</option>
                    <option value="scientific">Scientifique</option>
                    <option value="geography">Géographie</option>
                    <option value="history">Histoire</option>
                    <option value="technology">Technologie</option>
                    <option value="humour">Humour</option>
                    <option value="adult">Adulte</option>
                  </select>
                </div>
              </div>

              <button className={styles.formSubmitButton} type="submit">
                Proposer cette info
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitForm;
