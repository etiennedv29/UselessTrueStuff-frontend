import { useState } from "react";
//import styles from "../styles/Home.module.css";
import styles from "../styles/SubmitForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";

function SubmitFormComment(props) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author: "",
    description: "",
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

    const comment = {
      ...formData,
      submittedAt: new Date(),
      factId: props.factId,
    };

    try {
      const response = await fetch(
        //"http://localhost:3000/comments/addComment",
        "https://useless-true-stuff-backend.vercel.app/comments/addComment",
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


      alert("Comment submitted! Thanks");
      setFormData({ author: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Submission failed", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <span onClick={() => setShowForm(true)} className={styles.openButton}>
        Submit comment
      </span>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <FontAwesomeIcon
              icon={faSquareXmark}
              className={styles.closeButton}
              onClick={() => setShowForm(false)}
            />

            <h2 className={styles.popoverTitle}>What do you want to say?</h2>
            <form className={styles.submitForm} onSubmit={handleSubmit}>
              <div className={styles.formInputsContainer}>
                <input
                  className={styles.submitFormField}
                  type="text"
                  name="author"
                  placeholder="Your nickname"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />

                <textarea
                  className={styles.submitFormField}
                  name="description"
                  placeholder="What do you want to say?"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
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

export default SubmitFormComment;
