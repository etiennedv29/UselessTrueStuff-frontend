import styles from "../styles/Login.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../reducers/users";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { message, Modal } from "antd";
import ForgotPassword from "./ForgotPassword.js";
import { apiFetch } from "../utils/apiFetch";

function Login({ changeVisibleModal }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignupDisplay, setIsSignupDisplay] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(true);
  const [missingFields, setMissingFields] = useState(false);
  const [isCheckedCGU, setIsCheckedCGU] = useState(false);
  const [displayWarningCGU, setDisplayWarningCGU] = useState(false);
  const [visibleForgotPasswordModal, setVisibleForgotPasswordModal] =
    useState(false);

  useState(false);

  let msg = "";
  console.log("signup display = ", isSignupDisplay);
  // tous les messages d'erreur
  const incorrectPasswordErrorMessage =
    "Le mot de passe doit contenir 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère parmi #@$!%*?& et être d'au moins 8 caractères";
  const existingUserErrorMessage =
    "Il y en a déjà un qui a ton mail ou ton pseudo !";
  const missingFieldsErrorMessage = "Remplis tous les champs stp";
  const correctCredentialsErrorMessage =
    "Ton email et/ou ton mot de passe semblent incorrects";
  const displayWarningCGUErrorMessage =
    "Pour t'inscrire, il faut accepter les conditions d'utilisation stp";

  //password conditions
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/;

  useEffect(() => {
    setIsSignupDisplay(false);
  }, [changeVisibleModal]);

  // User connection
  async function handleSignin(
    email,
    password,
    connectionWithSocials = false,
    extraData = {}
  ) {
    if ((!connectionWithSocials && password === "") || email === "") {
      setMissingFields(true);
      return;
    } else {
      setMissingFields(false);
    }

    //abort signin if password is not satisfying regex
    if (!connectionWithSocials && !passwordRegex.test(password)) {
      setCorrectCredentials(!correctCredentials);
      return;
    }

    try {
      const data = await apiFetch("/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          connectionWithSocials,
          ...extraData,
        }),
      });

      dispatch(
        login({
          ...data,
        })
      );
      setUsername("");
      setPassword("");
      setEmail("");
      setCorrectCredentials(true);
      changeVisibleModal();
    } catch (error) {
      // gestion spécifique 401 (mauvais identifiants)
      if (error.message.includes("401")) {
        setCorrectCredentials(false);
      } else {
        msg = error.message;
      }
    }
  }

  // Create account
  async function handleSignup(
    firstName,
    lastName,
    username,
    password,
    email,
    connectionWithSocials = false
  ) {
    // Missing fields verification
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      (!connectionWithSocials && password === "") ||
      email === ""
    ) {
      setMissingFields(true);
      return;
    } else {
      setMissingFields(false);
    }

    // Abort signup process if password is not satisfying regex
    if (!connectionWithSocials && !passwordRegex.test(password)) {
      setCorrectCredentials(!correctCredentials);
      return;
    }

    // CGU checkbox verification
    if (!connectionWithSocials && !isCheckedCGU) {
      setDisplayWarningCGU(true);
      return;
    } else {
      setDisplayWarningCGU(false);
    }
    // Calling signup route
    console.log("calling signup route");

    try {
      const data = await apiFetch("/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
          connectionWithSocials,
        }),
      });

      setExistingUser(false);
      dispatch(
        login({
          ...data,
        })
      );
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setEmail("");
      router.push("/");
      changeVisibleModal();
    } catch (error) {
      // gestion spécifique 409 (utilisateur déjà existant)
      if (error.message.includes("409")) {
        setExistingUser(true);
      } else {
        msg = error.message;
      }
    }
  }

  // open modal for forgot Password functionnality
  async function handleForgotPasswordClick() {
    setOpenForgotPasswordModal(true);
    //message.info("Fonctionnalité à venir ;)");
  }

  function changeModalStateForgotPassword() {
    setVisibleForgotPasswordModal(!visibleForgotPasswordModal);
  }

  // Signin and signup box design
  let boxSize = {
    height: isSignupDisplay ? 600 : 410,
    transition: "height 0.15s ease-out",
  };

  // Switch from signin and signup
  const handleSwitchSignupClick = () => {
    setIsSignupDisplay(!isSignupDisplay);
  };

  // Switch to visible password and back
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="text-[#1ad4ff] w-full h-full flex flex-row justify-around items-start bg-[#0b0c1a] rounded-md pb-8 border-1 border-[#1ad4ff]">
      <Modal
        getContainer="#react-modals"
        open={visibleForgotPasswordModal}
        closable={false}
        footer={null}
        keyboard={true}
        maskClosable={true}
        onCancel={changeModalStateForgotPassword}
        width={500}
        className="modal"
      >
        <ForgotPassword changeVisibleModal={changeModalStateForgotPassword} />
      </Modal>
      <div className="flex flex-row justify-center w-full ease" style={boxSize}>
        {isSignupDisplay && (
          <div className="flex flex-col justify-center items-center w-full rounded-lg">
            <h2 className="text-center text-xl sm:text-xl font-bold mb-5">
              Crée un compte Useless True Stuff !
            </h2>
            {existingUser && (
              <p className="text-red-300">{existingUserErrorMessage}</p>
            )}
            {missingFields && (
              <p className="text-red-300">{missingFieldsErrorMessage}</p>
            )}
            <div className="flex flex-col items-center justify-between w-full">
              <div className="flex flex-col justify-between text-center items-center w-full gap-2 mb-2">
                <input
                  className="w-4/5 sm:w-3/5 h-10 rounded-md bg-white text-base pl-5"
                  type="text"
                  placeholder="Prénom"
                  id="signUpfirstName"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
                <input
                  className="w-4/5 sm:w-3/5 h-10 rounded-md bg-white text-base pl-5"
                  type="text"
                  placeholder="Nom"
                  id="signUpLastName"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
                <input
                  className="w-4/5 sm:w-3/5 h-10 rounded-md bg-white text-base pl-5"
                  type="text"
                  placeholder="Email"
                  id="signUpEmail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <input
                  className="w-4/5 sm:w-3/5 h-10 rounded-md bg-white text-base pl-5"
                  type="text"
                  placeholder="Pseudo"
                  id="signUpUsername"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="w-4/5 flex flex-col justify-center items-center ">
                <div className="h-10 w-full sm:w-4/5 flex flex-row justify-around items-center text-center ">
                  <input
                    className="w-full sm:w-4/5 h-full rounded-md border-1 border-[#0b0c1a] bg-white text-base pl-5"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    id="signUpPassword"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIncorrectPassword(passwordRegex.test(e.target.value));
                    }}
                    value={password}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSignup(
                          firstName,
                          lastName,
                          username,
                          password,
                          email,
                          (connectionWithSocials = false)
                        );
                      }
                    }}
                  />
                  <div
                    onClick={() => handleShowPassword()}
                    className="flex justify-center text-center w-1/5 "
                  >
                    {!showPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        color="#1ad4ff"
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        color="#1ad4ff"
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="ml-2 text-xs sm:text-md w-full sm:w-4/5"
                  style={
                    password.length < 8
                      ? { color: "#1ad4ff" }
                      : passwordRegex.test(password)
                      ? { color: "#A7D8A2" }
                      : { color: "lightcoral" }
                  }
                >
                  {incorrectPasswordErrorMessage}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mt-4 mb-1">
                <div className=" w-4/5 flex flex-row text-baseline items-center gap-1">
                  <input
                    type="checkbox"
                    checked={isCheckedCGU}
                    onChange={() => setIsCheckedCGU(!isCheckedCGU)}
                    className="pt-2"
                  />
                  <div className="text-baseline text-md sm:text-base items-start">
                    Accepter les CGU et la politique de confidentialité
                  </div>
                </div>
                {displayWarningCGU && (
                  <div className="text-red-300 text-sm sm:text-md">
                    {displayWarningCGUErrorMessage}
                  </div>
                )}
              </div>
              <button
                className="bg-[#1ad4ff] hover:bg-[#0b0c1a] text-[#0b0c1a] hover:text-[#1ad4ff] border-1 border-[#1ad4ff] my-5 font-bold w-2/5 h-10 rounded-md cursor-pointer"
                id="register"
                onClick={() =>
                  handleSignup(
                    firstName,
                    lastName,
                    username,
                    password,
                    email,
                    false
                  )
                }
              >
                Crée ton compte
              </button>
              <div
                className="cursor-pointer hover:text-white text-center"
                onClick={() => handleSwitchSignupClick()}
              >
                Déjà un compte ? Connecte-toi ici !
              </div>
            </div>
            <div className="flex flex-row w-4/5 items-center justify-center my-3">
              <div className=" w-2/5 border-1 border-[#1ad4ff] m-1"></div>
              <p className="text-md sm:text-lg">OU</p>
              <div className=" w-2/5 border-1 border-[#1ad4ff] m-1"></div>
            </div>
            <div>
              <GoogleLogin
                className=""
                text="continue_with"
                onSuccess={(credentialResponse) => {
                  let googleUserInfo = jwtDecode(credentialResponse.credential);
                  handleSignup(
                    googleUserInfo.given_name,
                    googleUserInfo.family_name,
                    googleUserInfo.name,
                    "",
                    googleUserInfo.email,
                    true
                  );
                }}
              />
            </div>

            <div className="text-red-300 text-sm sm:text-md"> {msg} </div>
          </div>
        )}
        {!isSignupDisplay && (
          <div className="flex flex-col justify-center items-center w-full rounded-lg ">
            <h2 className="text-center text-xl sm:text-2xl font-bold">
              Connexion
            </h2>
            {missingFields && (
              <p className="text-red-300">{missingFieldsErrorMessage}</p>
            )}
            {!correctCredentials && (
              <p className="text-red-300">{correctCredentialsErrorMessage}</p>
            )}
            <div className="flex flex-col items-center justify-between w-full  gap-2">
              <div className="h-10 w-4/5 flex flex-col justify-between text-center items-center ">
                <input
                  className="w-full sm:w-4/5 h-full rounded-md border-1 border-[#0b0c1a] bg-white text-base pl-5 "
                  type="text"
                  placeholder="Email"
                  id="signInEmail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="w-full sm:w-4/5 flex flex-col justify-between items-center  ">
                <div className="h-10 w-4/5 flex flex-row justify-around items-center text-center ">
                  <input
                    className="w-full sm:w-4/5 h-full rounded-md border-1 border-[#0b0c1a] bg-white text-base pl-5"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    id="signInPassword"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSignin(
                          email,
                          password,
                          (connectionWithSocials = false)
                        );
                      }
                    }}
                  />
                  <div
                    onClick={() => handleShowPassword()}
                    className="flex justify-center text-center w-1/5 "
                  >
                    {!showPassword ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        color="#1ad4ff"
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        color="#1ad4ff"
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="text-xs sm:text-md cursor-pointer "
                  onClick={changeModalStateForgotPassword}
                >
                  Mot de passe oublié ?
                </div>
              </div>
              <button
                className="bg-[#1ad4ff] text-[#0b0c1a] hover:text-[#1ad4ff] hover:bg-[#0b0c1a] my-5 font-bold text-lg sm:text-xl w-2/5 h-10 rounded-md cursor-pointer px-3 items-center text-center justify-center flex "
                id="connection"
                onClick={() => {
                  handleSignin(email, password, false);
                }}
              >
                Connexion
              </button>
              <div
                className="cursor-pointer text-center text-md sm:text-base hover:text-white"
                onClick={() => handleSwitchSignupClick()}
              >
                Pas encore de compte ? Inscris-toi !
              </div>
            </div>
            <div className="flex flex-row w-4/5 items-center justify-center my-3">
              <div className=" w-2/5 border-1 border-[#1ad4ff] m-1"></div>
              <p className="text-md sm:text-lg">OU</p>
              <div className=" w-2/5 border-1 border-[#1ad4ff] m-1"></div>
            </div>
            <div className="">
              <GoogleLogin
                className=""
                text="continue_with"
                onSuccess={(credentialResponse) => {
                  let googleUserInfo = jwtDecode(credentialResponse.credential);
                  handleSignin(googleUserInfo.email, "", true, {
                    firstName: googleUserInfo.given_name,
                    lastName: googleUserInfo.family_name,
                    username: googleUserInfo.name,
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
