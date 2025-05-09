import styles from "../styles/Login.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../reducers/users";
import { prefix } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  let msg = "";

  // Fonction de connexion au site
  async function handleSignin() {
    console.log("want to signin");
    const response = await fetch(
      //"http://localhost:3000/users/signin",
      'https://useless-true-stuff-backend.vercel.app/users/signin'
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    try {
      dispatch(
        login({
          _id: data._id,
          firstname: data.firstname,
          username,
          token: data.token,
        })
      );
      setusername("");
      setPassword("");
      router.push("/");
    } catch (error) {
      msg = data.error;
    }
  }

  async function handleSignup() {
    const response = await fetch(
      //"http://localhost:3000/users/signup",
      'https://useless-true-stuff-backend.vercel.app/users/signup',
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastName,
          email,
          username,
          password,
        }),
      }
    );
    const data = await response.json();
    try {
      dispatch(
        login({ _id: data._id, firstname, username, token: data.token })
      );
      setusername("");
      setPassword("");
      router.push("/");
    } catch (error) {
      msg = data.error;
    }
  }

  let boxSize = {
    height: isSignup ? 550 : 300,
    transition: "height 0.15s ease-out",
  };
  const handleSwitchSignupClick = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className={styles.connectSectionContainer}>
      {isSignup && (
        <div className={styles.registerContainer} style={boxSize}>
          <div className={styles.registerSection}>
            <h2 className={styles.loginModalTitle}>
              Come and join UselessTrueStuff!
            </h2>
            <input
              className={styles.loginField}
              type="text"
              placeholder="Firstname"
              id="signUpFirstname"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstname}
            />
            <input
              className={styles.loginField}
              type="text"
              placeholder="LastName"
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
              onChange={(e) => setusername(e.target.value)}
              value={username}
            />

            <input
              className={styles.loginField}
              type="password"
              placeholder="Password"
              id="signUpPassword"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
            />
            <input
              className={styles.loginField}
              type="text"
              placeholder="Confirm Password"
              id="signUpUsername"
              onChange={(e) => setusername(e.target.value)}
              value={username}
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
        </div>
      )}

      {!isSignup && (
        <div className={styles.registerContainer} style={boxSize}>
          <div className={styles.registerSection}>
            <h2 className={styles.loginModalTitle}>Sign-in</h2>
            <input
              className={styles.loginField}
              type="text"
              placeholder="Username"
              id="signInUsername"
              onChange={(e) => setusername(e.target.value)}
              value={username}
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
        </div>
      )}
    </div>
  );
}

export default Login;
