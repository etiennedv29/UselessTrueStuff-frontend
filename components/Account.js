import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Login from "./Login";
import Modal from "antd/lib/modal";
import Link from "next/link";
import { Popconfirm, message } from "antd";
import { useRouter } from "next/router";
import { login, logout } from "../reducers/users";
import { apiFetch } from "../utils/apiFetch";

function Account() {
  const router = useRouter();
  const userData = useSelector((state) => state.users.value);
  const dispatch = useDispatch();

  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [accountInfoValues, setValues] = useState({
    username: userData.username,
    email: userData.email,
  });
  const [activeField, setActiveField] = useState(null);

  const refs = {
    email: useRef(null),
    username: useRef(null),
  };

  const [initialAccountInfoValues, setInitialAccountInfo] = useState({
    username: "",
    email: "",
  });
  const [accountFactsData, setAccountFactsData] = useState([]);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [loadingDeletePopUp, setLoadingDeletePopUp] = useState(false);

  const [preferencesValues, setPreferences] = useState({});
  const [initialPreferences, setInitialPreferences] = useState({});
  let msg = "";

  const preferencesFields = [
    { key: "commentValidationNotification", label: "Validation d'un commentaire" },
    { key: "voteSubmissionNotification", label: "Validation d'un vote" },
    { key: "factVerificationNotification", label: "Validation ou rejet d'un fait proposé" },
    { key: "dailyFactUpdateNotification", label: "Recevoir l'info du jour par mail (recommandé)" },
  ];

  // init user data
  useEffect(() => {
    if (userData?._id) {
      setValues({
        username: userData.username || "",
        email: userData.email || "",
      });
      setInitialAccountInfo({
        username: userData.username || "",
        email: userData.email || "",
      });
      setPreferences(userData.preferences || {});
      setInitialPreferences(userData.preferences || {});
    }
  }, [userData?._id]);

  useEffect(() => {
    if (!userData?._id) {
      setVisibleModalLogin(true);
    }
  }, [userData?._id]);

  useEffect(() => {
    if (activeField && refs[activeField]?.current) {
      refs[activeField].current.focus();
    }
  }, [activeField]);

  function changeModalStateLogin() {
    setVisibleModalLogin(!visibleModalLogin);
  }

  const handleEdit = (field) => {
    setActiveField(field);
  };

  const handleChange = (e, field) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const accountInfoHasChanged = () => {
    for (const key in accountInfoValues) {
      if (accountInfoValues[key] !== initialAccountInfoValues[key]) {
        return true;
      }
    }
    return false;
  };

  async function handleAccountModificationsValidation(userId, username, email) {
    try {
      const updateUserResponse = await apiFetch(`/users/updateAccount`, {
        method: "PUT",
        body: JSON.stringify({ userId, username, email }),
      });

      dispatch(
        login({
          ...userData,
          _id: updateUserResponse._id,
          username: updateUserResponse.username,
          email: updateUserResponse.email,
          accessToken: updateUserResponse.accessToken,
          accessTokenExpirationDate: updateUserResponse.accessTokenExpirationDate,
          refreshToken: updateUserResponse.refreshToken,
          refreshTokenExpirationDate: updateUserResponse.refreshTokenExpirationDate,
        })
      );
      message.success("Infos mises à jour");
    } catch (e) {
      console.error("Erreur update compte", e);
      message.error("Erreur lors de la mise à jour");
    }
  }

  async function getAccountFacts() {
    if (!userData?._id) return;
    try {
      const data = await apiFetch(`/facts/search?userId=${userData._id}`, {
        method: "GET",
      });

      setAccountFactsData(
        data?.map((fact) => ({
          factTitle: fact.title,
          factDescription: fact.description,
          factAuthor: fact.userID,
          factSubmittedAt: fact.submittedAt,
          nbVotesPlus: fact.votePlus,
          nbVotesMinus: fact.voteMinus,
          factComments: fact.comments,
          factImage: fact.image,
          factId: fact._id,
        })) || []
      );
    } catch (e) {
      console.error("Erreur récupération facts utilisateur", e);
    }
  }

  useEffect(() => {
    userData._id && getAccountFacts();
  }, [userData._id]);

  const factsInfoToDisplay = accountFactsData?.map((data, i) => (
    <Link
      href={`/facts/${data.factId}`}
      className="decoration-none cursor-pointer hover:text-white"
      key={i}
    >
      <div>{`- ${data.factTitle}`}</div>
    </Link>
  ));

  async function handleConfirmDelete() {
    if (!userData?._id) {
      message.error("Utilisateur introuvable.");
      return;
    }

    try {
      setLoadingDeletePopUp(true);

      await apiFetch(`/users/softDelete`, {
        method: "POST",
        body: JSON.stringify({
          userId: userData._id,
          email: userData.email,
        }),
      });

      message.success("Ton compte a bien été supprimé.");
      await router.push("/");
      dispatch(logout());
    } catch (e) {
      console.error("Erreur suppression de compte", e);
      message.error("Échec de la suppression");
    } finally {
      setLoadingDeletePopUp(false);
      setOpenDeletePopUp(false);
    }
  }

  const handleTogglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const preferencesHaveChanged = () => {
    for (const key in preferencesValues) {
      if (preferencesValues[key] !== initialPreferences[key]) {
        return true;
      }
    }
    return false;
  };

  const handleSavePreferences = async () => {
    try {
      const updateUserResponse = await apiFetch(`/users/updateAccount`, {
        method: "PUT",
        body: JSON.stringify({
          preferences: preferencesValues,
          userId: userData._id,
        }),
      });

      dispatch(
        login({
          ...userData,
          preferences: updateUserResponse.preferences,
        })
      );

      setInitialPreferences(preferencesValues);
      message.success("Préférences mises à jour");
    } catch (e) {
      console.error("Erreur update prefs", e);
      message.error("Erreur lors de la mise à jour des préférences");
    }
  };

  return (
    <div className="bg-[#0b0c1a] pt-10 justify-center font-[Trebuchet MS] flex flex-row ">
      {!userData._id && (
        <Modal
          getContainer="#react-modals"
          open={visibleModalLogin}
          closable={false}
          footer={null}
          onCancel={changeModalStateLogin}
          width={500}
          className="modal"
        >
          <Login changeVisibleModal={changeModalStateLogin} />
        </Modal>
      )}

      {userData._id && (
        <div className="w-full flex flex-col justify-center items-center text-[#0b0c1a] gap-10">
          {/* Profil */}
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
            <h2 className="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
              Profil
            </h2>
            <div className="flex flex-row justify-between w-full ">
              <div className="w-2/5 pl-1 flex flex-col text-[#1ad4ff]">
                <p>Pseudo actuel</p>
              </div>
              <div className="w-3/5 sm:w-1/2 flex flex-col text-[#1ad4ff]">
                <p>{userData.username}</p>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
            <h2 className="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
              Informations
            </h2>
            {/* Username */}
            <div className="flex flex-row justify-between items-center w-full text-[#1ad4ff] gap-1 pr-1 ">
              <div className="w-2/5 pl-1 text-sm sm:text-base">Pseudo</div>
              <div className="flex flex-row items-center gap-1 w-3/5 sm:w-1/2 ">
                <input
                  className="h-10 w-full rounded-md border bg-white text-[#0b0c1a] pl-2 pr-2"
                  onChange={(e) => handleChange(e, "username")}
                  value={accountInfoValues.username}
                  readOnly={activeField !== "username"}
                  ref={refs.username}
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#1ad4ff"
                  className="cursor-pointer h-5 m-2"
                  onClick={() => handleEdit("username")}
                />
              </div>
            </div>
            {/* Email */}
            <div className="flex flex-row justify-between items-center w-full text-[#1ad4ff] gap-1 pr-1">
              <div className="w-2/5 pl-1 text-sm sm:text-base">Email</div>
              <div className="flex flex-row items-center gap-1 w-3/5 sm:w-1/2">
                <input
                  value={accountInfoValues.email}
                  className="h-10 w-full rounded-md border bg-white text-[#0b0c1a] pl-2 pr-2"
                  onChange={(e) => handleChange(e, "email")}
                  readOnly={activeField !== "email"}
                  ref={refs.email}
                />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  color="#1ad4ff"
                  className="cursor-pointer h-5 m-2"
                  onClick={() => handleEdit("email")}
                />
              </div>
            </div>
            {/* Save */}
            <button
              className="w-auto px-2 py-0.5 text-base font-bold bg-[#a7d8a2] border rounded-md mt-5 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#b0b5ba]"
              disabled={!accountInfoHasChanged()}
              onClick={() =>
                handleAccountModificationsValidation(
                  userData._id,
                  accountInfoValues.username,
                  accountInfoValues.email
                )
              }
            >
              Enregistrer mes infos
            </button>
            <div className="text-red-300 text-center text-sm">{msg}</div>
          </div>

          {/* Statistiques */}
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center gap-1">
            <h2 className="border-b-1 border-b-[#1ad4ff] w-full text-center text-[#1ad4ff] pb-1 text-md sm:text-lg">
              Statistiques
            </h2>
            <div className="w-full pl-1 text-sm text-[#1ad4ff] flex flex-col">
              <div>Likes + : {userData.votePlus?.length}</div>
              <div>Dislikes - : {userData.voteMinus?.length}</div>
              <div className="flex flex-row gap-4 mt-3">
                <div>Faits validés : {userData.factsSubmitted?.length}</div>
                <div className="w-full">{factsInfoToDisplay}</div>
              </div>
            </div>
          </div>

          {/* Préférences */}
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center text-[#1ad4ff] mb-15">
            <h2 className="border-b-1 border-b-[#1ad4ff] w-full text-center text-md sm:text-lg">
              Préférences
            </h2>
            <div className="w-full pl-1">Communications par mail</div>
            <div className="w-full flex flex-col gap-2 pl-2">
              {preferencesFields.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferencesValues[key]}
                    onChange={() => handleTogglePreference(key)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <button
              onClick={handleSavePreferences}
              disabled={!preferencesHaveChanged()}
              className={`my-5 w-auto px-3 py-1 text-base font-bold rounded-md ${
                preferencesHaveChanged()
                  ? "text-[#0b0c1a] bg-[#a7d8a2] hover:bg-[#8ecf87]"
                  : "text-[#0b0c1a] bg-[#b0b5ba] cursor-not-allowed"
              }`}
            >
              Enregistrer mes préférences
            </button>

            {/* Delete */}
            <div className="w-full pl-1 flex-col flex justify-center items-center">
              <Popconfirm
                title="Supprimer mon compte"
                description="Action irréversible. Confirme pour supprimer ton compte."
                okText="Oui, supprimer"
                cancelText="Annuler"
                okButtonProps={{ danger: true, loadingDeletePopUp }}
                open={openDeletePopUp}
                onConfirm={handleConfirmDelete}
                onCancel={() => setOpenDeletePopUp(false)}
              >
                <p
                  className="w-4/5 sm:w-2/5 text-[#0b0c1a] bg-[#1ad4ff] rounded-sm font-bold text-center mt-10 cursor-pointer hover:bg-red-300"
                  onClick={() => setOpenDeletePopUp(true)}
                >
                  Supprimer mon compte
                </p>
              </Popconfirm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
