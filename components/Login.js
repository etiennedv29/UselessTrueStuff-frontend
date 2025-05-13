import styles from "../styles/Login.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../reducers/users";
import { rememberOrigin } from "../reducers/navigations";
//import { prefix } from "@fortawesome/free-solid-svg-icons";
//import { useServerInsertedHTML } from "next/dist/shared/lib/server-inserted-html.shared-runtime";

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignupDisplay, setIsSignupDisplay] = useState(false);
  const [matchingPasswords, setMatchingPasswords] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(true);
  const [missingFields, setMissingFields] = useState(false);
  let msg = "";

  //récupération de l'url précédente au signin


  const previousPage = useSelector((state) => state.navigations.loginOrigin);

  // Fonction de connexion au site
  async function handleSignin() {
    console.log("want to signin");
    if (password === "" || email === "") {
      setMissingFields(true);
      return;
    }

    const response = await fetch(
      //"http://localhost:3000/users/signin",
      "https://useless-true-stuff-backend.vercel.app/users/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    try {
      if (response.status === 200) {
        dispatch(
          login({
            _id: data._id,
            firstName: data.firstName,
            username,
            token: data.token,
          })
        );
        setUsername("");
        setPassword("");
        setEmail("");
        setMissingFields(false);
        router.push(`${previousPage}`);
        dispatch(rememberOrigin(""));
      } else if (response.status === 401) {
        setCorrectCredentials(false);
      }
    } catch (error) {
      msg = data.error;
    }
  }

  async function handleSignup() {
    console.log("signup try");
    if (matchingPasswords) {
      console.log("unmatching passwords");
      return;
    }
    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      password === "" ||
      email === ""
    ) {
      console.log("missing fields");
      setMissingFields(true);
      return;
    }
    const response = await fetch(
      //"http://localhost:3000/users/signup",
      "https://useless-true-stuff-backend.vercel.app/users/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    try {
      if (response.status === 200) {
        setExistingUser(false);
        dispatch(
          login({ _id: data._id, firstName, username, token: data.token })
        );
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setfirstName("");
        setLastName("");
        setEmail("");
        setMissingFields(false);
        router.push(`${previousPage}`);
      } else if (response.status === 409) {
        setExistingUser(true);
      }
    } catch (error) {
      msg = data.error;
    }
  }

  let boxSize = {
    height: isSignupDisplay ? 550 : 300,
    transition: "height 0.15s ease-out",
  };
  const handleSwitchSignupClick = () => {
    setIsSignupDisplay(!isSignupDisplay);
  };

  return (
    <div className={styles.connectSectionContainer}>
      <div className={styles.registerContainer} style={boxSize}>
        {isSignupDisplay && (
          <div className={styles.registerSection}>
            <h2 className={styles.loginModalTitle}>
              Come and join UselessTrueStuff!
            </h2>
            {existingUser && (
              <p style={{ color: "red" }}>
                {" "}
                A user with this email or username already exists
              </p>
            )}
            {missingFields && (
              <p style={{ color: "red" }}>All fields are required</p>
            )}
            <input
              className={styles.loginField}
              type="text"
              placeholder="First name"
              id="signUpfirstName"
              onChange={(e) => setfirstName(e.target.value)}
              value={firstName}
            />
            <input
              className={styles.loginField}
              type="text"
              placeholder="Last name"
              id="signUpLastName"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
            <input
              className={styles.loginField}
              type="text"
              placeholder="email"
              id="signUpEmail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className={styles.loginField}
              type="text"
              placeholder="Username"
              id="signUpUsername"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />

            <input
              className={styles.loginField}
              type="password"
              placeholder="Password"
              id="signUpPassword"
              onChange={(e) => {
                setPassword(e.target.value);
                confirmPassword === password
                  ? setMatchingPasswords(true)
                  : setMatchingPasswords(false);
              }}
              value={password}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
              style={
                confirmPassword != ""
                  ? password === confirmPassword
                    ? { "background-color": "lightgreen" }
                    : { "background-color": "lightcoral" }
                  : {}
              }
            />
            <input
              className={styles.loginField}
              type="password"
              placeholder="Confirm Password"
              id="signUpConfirmPassword"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                confirmPassword === password
                  ? setMatchingPasswords(true)
                  : setMatchingPasswords(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
              value={confirmPassword}
              style={
                confirmPassword != ""
                  ? password === confirmPassword
                    ? { "background-color": "lightgreen" }
                    : { "background-color": "lightcoral" }
                  : {}
              }
            />
            <button
              className={styles.modalSigninButton}
              id="register"
              onClick={() => handleSignup()}
            >
              {" "}
              Sign up{" "}
            </button>
            <div
              className={styles.switchSignup}
              onClick={() => handleSwitchSignupClick()}
            >
              Already have an account? Signin here!
            </div>
            <div className={styles.errorMsg}> {msg} </div>
          </div>
        )}
        {!isSignupDisplay && (
          <div className={styles.registerSection}>
            <h2 className={styles.loginModalTitle}>Sign in</h2>
            {missingFields && (
              <p style={{ color: "red" }}>All fields are required</p>
            )}
            {!correctCredentials && (
              <p style={{ color: "red" }}>
                Are your email and password true stuff ?{" "}
              </p>
            )}

            <input
              className={styles.loginField}
              type="text"
              placeholder="Email"
              id="signInEmail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              className={styles.loginField}
              type="password"
              placeholder="Password"
              id="signInPassword"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignin();
                }
              }}
            />
            <button
              className={styles.modalSigninButton}
              id="connection"
              onClick={() => handleSignin()}
            >
              Sign in
            </button>
            <div
              className={styles.switchSignup}
              onClick={() => handleSwitchSignupClick()}
            >
              Don't have an account yet? More of useless here!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
