import styles from "../styles/Account.module.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../reducers/users";

function Account(props) {
  let userData = useSelector((state) => state.users.value);

  let msg = "";
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    username: userData.username,
    email: userData.email,
  });
  const [isEditableState, setIsEditableState] = useState({
    name: false,
    email: false,
    username: false,
  });
  const [activeField, setActiveField] = useState(null);
  const refs = {
    name: useRef(null),
    email: useRef(null),
    username: useRef(null),
  };

  useEffect(() => {
    if (activeField && refs[activeField]?.current) {
      refs[activeField].current.focus();
    }
  }, [activeField]);

  const handleEdit = (field) => {
    setActiveField(field);
  };

  const handleChange = (e, field) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const accountInfoHasChanged = () => {
    return (
      values.username !== userData.username || values.email !== userData.email
    );
  };

  async function handleAccountModificationsValidation(userId, username, email) {
    //update du back
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/users/updateAccount`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          username,
          email,
        }),
      }
    );
    const updateUserResponse = await response.json();
    try {
      if (response.status === 200) {
        dispatch(
          login({
            _id: updateUserResponse._id,
            username: updateUserResponse.username,
            token: updateUserResponse.token,
            firstName: updateUserResponse.firstName,
            connectionWithSocials: updateUserResponse.connectionWithSocials,
            votePlus: updateUserResponse.votePlus,
            voteMinus: updateUserResponse.voteMinus,
          })
        );

        userData = useSelector((state) => state.users.value);
      }
    } catch (exception) {
      msg = updateUserResponse.error;
    }
  }

  return (
    <div className={styles.accountContainer}>
      <div className={styles.accountRight}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Profil</h2>
          <div className={styles.profileSection}>
            <div className={styles.profileLeft}>
              <div className={styles.profileUsername}>{userData.username}</div>
            </div>
            <div className={styles.profileRight}></div>
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Informations</h2>
          <div className={styles.detailedInfoData}>
            <div className={styles.detailedInfoDataLeft}>
              <div className={styles.detailedInfoFieldName}>Pseudo</div>
              <div className={styles.detailedInfoFieldName}>Mot de Passe</div>
              <div className={styles.detailedInfoFieldName}>Email</div>
            </div>
            <div className={styles.detailedInfoDataRight}>
              <div className={styles.detailedInfoUserDataContainer}>
                <input
                  className={styles.detailedInfoUserDataField}
                  onChange={(e) => {
                    handleChange(e, "username");
                  }}
                  value={values.username}
                  readOnly={activeField !== "username"}
                  ref={refs.username}
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#1ad4ff"
                  className={styles.modifyAccountInfoIcon}
                  onClick={() => handleEdit("username")}
                />
              </div>
              <div className={styles.detailedInfoUserDataContainer}>
                <input
                  onChange={() => {}}
                  defaultValue="***********"
                  className={styles.detailedInfoUserDataField}
                  type="password"
                  disabled={userData.connectionWithSocials}
                  style={
                    userData.connectionWithSocials
                      ? { backgroundColor: "gray" }
                      : { backgroundColor: "white" }
                  }
                />
                <button
                  className={styles.modifyPasswordButton}
                  id="modifyPassword"
                  onClick={() => {}}
                  disabled={userData.connectionWithSocials}
                >
                  Changer ton mot de passe
                </button>
              </div>

              <div className={styles.detailedInfoUserDataContainer}>
                <input
                  value={values.email}
                  className={styles.detailedInfoUserDataField}
                  onChange={(e) => handleChange(e, "email")}
                  readOnly={activeField !== "email"}
                  ref={refs.email}
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#1ad4ff"
                  className={styles.modifyAccountInfoIcon}
                  onClick={() => handleEdit("email")}
                />
              </div>

            </div>
          </div>
          <button
            className={
              accountInfoHasChanged()
                ? styles.validationButtonEnabled
                : styles.validationButtonDisabled
            }
            disabled={!accountInfoHasChanged()}
            onClick={() =>
              handleAccountModificationsValidation(
                userData._id,
                values.username,
                values.email,
                values.name
              )
            }
          >
            Enregistrer
          </button>
          <div className={styles.errorMsg}> {msg} </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Statistiques</h2>
            <div className = {styles.dataInfo}> Nombre de likes + : {userData.votePlus.length}</div>
            <div className = {styles.dataInfo}> Nombre de dislikes - : {userData.voteMinus.length}</div>
            <div className = {styles.dataInfoFactsSubmitted}> Nombre de faits soumis : {userData.factsSubmitted.length}</div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Préférences</h2>
        </div>
      </div>
    </div>
  );
}

export default Account;
