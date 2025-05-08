import { useState } from "react";
//import styles from "../styles/Home.module.css";
import styles from "../styles/SubmitForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

function SubmitForm(props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userID: "",
    title: "",
    description: "",
    category: "",
  });

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
      image: "https://picsum.photos/seed/picsum/200/200",
      userID: "123456",
    };

    try {
      const response = await fetch(
        //"http://localhost:3000/facts/addFact",
        "https://useless-true-stuff-backend.vercel.app/facts/addFact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fact),
        }
      );
      const addedFact = await response.json();
      console.log("added fact =>", addedFact);
      console.log("id de l'added fact = ", addedFact._id);

     

      await fetch(
        //"http://localhost:3000/facts/checkFact", 
        "https://useless-true-stuff-backend.vercel.app/facts/checkFact",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: addedFact.description,
          id: addedFact._id,
        }),
      });

      alert("Fact submitted!");
      setFormData({ userID: "", title: "", description: "", category: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Submission failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <span onClick={() => setShowForm(true)} className={styles.openButton}>
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
              Yipee ! Something true and useless
            </h2>
            <form className={styles.submitForm} onSubmit={handleSubmit}>
              <div className={styles.formInputsContainer}>
                <input
                  className={styles.submitFormField}
                  type="text"
                  name="userID"
                  placeholder="Your nickname"
                  value={formData.userID}
                  onChange={handleChange}
                  required
                />
                <input
                  className={styles.submitFormField}
                  type="text"
                  name="title"
                  placeholder="Title of your fact"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <textarea
                  className={styles.submitFormField}
                  name="description"
                  placeholder="What's so true and useless ?"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <div className={styles.formCategoryContainer}>
                  <p className={styles.formCategoryText}>Category:</p>
                  <select
                    className={styles.formCategorySelector}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="general">General</option>
                    <option value="scientific">Scientific</option>
                    <option value="geography">Geography</option>
                    <option value="history">History</option>
                    <option value="technology">Technology</option>
                    <option value="humour">Humour</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>
              </div>

              <button className={styles.formSubmitButton} type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitForm;
