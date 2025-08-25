import styles from "../styles/Account.module.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { login } from "../reducers/users";
import Link from "next/link";


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
  const [accountFactsData, setAccountFactsData] = useState([]);

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

  async function getAccountFacts() {
    let response;
    let data;
    console.log("getting account facts");
    if (userData._id) {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/search?userId=${userData._id}`
      );
      data = await response.json();
    }

    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        factAuthor: fact.userID,
        factSubmittedAt: fact.submittedAt,
        nbVotesPlus: fact.votePlus,
        nbVotesMinus: fact.voteMinus,
        factComments: fact.comments,
        factImage: fact.image,
        factId: fact._id,
      };
      return newFactFormat;
    });
    setAccountFactsData(newFactsData);
  }

  useEffect(() => {
    getAccountFacts();
  }, [userData._id]);

  const factsInfoToDisplay = accountFactsData.map((data, i) => {
    return (
      <Link href={`/facts/${data.factId}`} className={styles.link}>
        <div className={styles.footerNav}>{data.factTitle}</div>
      </Link>
    );
  });


  return (
    <div class = "bg-[#0b0c1a] pt-10 justify-center font-[Trebuchet MS] flex flex-row ">
      <div class = "w-full flex flex-col justify-center items-center text-[#0b0c1a]  gap-10">
        {/* <div className={styles.sectionContainer}> */}
        <div class = "w-4/5 flex flex-col items-center justify-center ">
          <h2 className={styles.sectionTitle}>Profil</h2>
          <div className={styles.profileSection}>
            <div className={styles.profileLeft}>
              <p className={styles.profileUsername}>{userData.username}</p>
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
          <div className={styles.dataContainer}>
            <div className={styles.dataInfo}>
              Nombre de likes + : {userData.votePlus.length}
            </div>
            <div className={styles.dataInfo}>
              Nombre de dislikes - : {userData.voteMinus.length}
            </div>
            <div className={styles.factsSubmittedContainer}>
              <div className={styles.dataInfoFactsSubmitted}>
                Nombre de faits validés : {userData.factsSubmitted.length}
              </div>
              <div className={styles.accountFactsSubmittedValidated}>
                {factsInfoToDisplay}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Préférences</h2>
        </div>
      </div>
    </div>
  );
}

export default Account;
