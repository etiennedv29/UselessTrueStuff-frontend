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
      <Link href={`/facts/${data.factId}`} class ="decoration-none cursor-pointer">
        <div>{data.factTitle}</div>
      </Link>
    );
  });

  return (
    <div class="bg-[#0b0c1a] pt-10 justify-center font-[Trebuchet MS] flex flex-row ">
      <div class="w-full flex flex-col justify-center items-center text-[#0b0c1a]  gap-10">
        <div class="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
          <h2 class="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
            Profil
          </h2>
          <div class="flex flex-row justify-between w-full ">
            <div class="w-2/5 pl-1 flex flex-col items-baseline text-[#1ad4ff] justify-center text-sm sm:text-base">
              <p>Pseudo actuel</p>
            </div>
            <div class="w-3/5 sm:w-1/2 flex flex-col items-baseline text-[#1ad4ff] justify-center text-sm sm:text-base ">
              <p>{userData.username}</p>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
          <h2 class="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
            Informations
          </h2>
          <div class="w-full flex flex-col">
            <div class=" flex flex-row justify-between items-center w-full text-[#1ad4ff] gap-1 pr-1 ">
              <div class="w-2/5 pl-1 items-baseline text-sm sm:text-base ">
                Pseudo
              </div>
              <div class="flex flex-row text-center items-center gap-1 justify-center w-3/5 sm:w-1/2 ">
                <input
                  class=" h-10 w-full rounded-md border-1 border-[#0b0c1a] bg-white text-[#0b0c1a] text-md sm:text-base pl-2 pr-2 outline-none cursor-default items-center hover:border-1 hover:border-[#4a90e2]"
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
                  class="cursor-pointer h-5 w-auto object-contain m-2"
                  onClick={() => handleEdit("username")}
                />
              </div>
            </div>
            <div class=" flex flex-row justify-between items-center w-full text-[#1ad4ff] gap-1 pr-1">
              <div class="w-2/5 pl-1 items-baseline text-sm sm:text-base">
                Mot de passe
              </div>
              <div class="flex flex-row text-center items-center gap-1 justify-center w-3/5 sm:w-1/2 ">
                <input
                  onChange={() => {}}
                  defaultValue="***********"
                  class="disabled:cursor-not-allowed h-10 w-full rounded-md border-1 border-[#0b0c1a] bg-white text-[#0b0c1a] text-md sm:text-base pl-2 pr-2 outline-none cursor-default items-center hover:border-1 hover:border-[#4a90e2]"
                  type="password"
                  disabled={userData.connectionWithSocials}
                  style={
                    userData.connectionWithSocials
                      ? { backgroundColor: "gray" }
                      : { backgroundColor: "white" }
                  }
                />

                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={
                    userData.connectionWithSocials
                      ? { color: "gray" }
                      : { color: "#4a90e2" }
                  }
                  disabled={userData.connectionWithSocials}
                  class=" cursor-pointer h-5 w-auto object-contain m-2"
                  onClick={() => {}}
                />
              </div>
            </div>
            <div class=" flex flex-row justify-between items-center w-full text-[#1ad4ff] gap-1 pr-1">
              <div class="w-2/5 pl-1 items-baseline text-sm sm:text-base">
                Email
              </div>
              <div class="flex flex-row text-center items-center gap-1 justify-center w-3/5 sm:w-1/2">
                <input
                  value={values.email}
                  class="h-10 w-full rounded-md border-1 border-[#0b0c1a] bg-white text-[#0b0c1a] text-md sm:text-base pl-2 pr-2 outline-none cursor-default items-center hover:border-1 hover:border-[#4a90e2]"
                  onChange={(e) => handleChange(e, "email")}
                  readOnly={activeField !== "email"}
                  ref={refs.email}
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#1ad4ff"
                  class="cursor-pointer h-5 w-auto object-contain m-2"
                  onClick={() => handleEdit("email")}
                />
              </div>
            </div>
          </div>
          <button
            class="w-auto h-auto px-2 py-0.5 text-base sm:text-large text-[#0b0c1a] font-bold bg-[#a7d8a2] border-1 border-[#a7d8a2] rounded-md mt-5 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#b0b5ba] disabled:text-[#0b0c1a] disabled:border-[#b0b5ba]"
            // className={
            //   accountInfoHasChanged()
            //     ? styles.validationButtonEnabled
            //     : styles.validationButtonDisabled
            // }
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
          <div class ="text-red-300 text-center items-center text-sm sm:text-md" > {msg} </div>
        </div>
        <div class="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
          <h2 class="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
            Statistiques
          </h2>
          <div class="w-full pl-1 text-sm sm:text-base border-2 border-amber-500 flex flex-col text-[#1ad4ff]">
            <div >
              Nombre de likes + : {userData.votePlus.length}
            </div>
            <div >
              Nombre de dislikes - : {userData.voteMinus.length}
            </div>
            <div class="flex flex-row text-baseline gap-4 mt-3">
              <div>
                Nombre de faits validés : {userData.factsSubmitted.length}
              </div>
              <div className={styles.accountFactsSubmittedValidated}>
                {factsInfoToDisplay}
              </div>
            </div>
          </div>
        </div>
        <div class="w-4/5 flex flex-col items-center justify-center ">
          <h2 class="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
            Préférences
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Account;
