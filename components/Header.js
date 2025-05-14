import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import SubmitForm from "./SubmitForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/users";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.users.value.username);
  const token = useSelector((state) => state.users.value.token);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.globalInfo}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.link}>
            <Image
              className={styles.logoImage}
              src="/uselessTrueStuff_logo.jpg"
              alt="UselessTrueStuff logo"
              width={133}
              height={100}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <div className={styles.logoCatchPhrase}>
            <h1 className={styles.logoCatchPhrase}>
             Des trucs vrais mais vraiment inutiles
            </h1>
          </div>
        </div>

        <div className={styles.userInfoContainer}>
          {token === "" ? (
            <Link href="/login" className={styles.link} >
              <FontAwesomeIcon
                icon={faUser}
                className={styles.userImage}
                style={{ color: "#1ad4ff", cursor: "pointer" }}
              />
            </Link>
          ) : (
            <Link href="/account" className={styles.link}>
              <FontAwesomeIcon
                icon={faUser}
                className={styles.userImage}
                style={{ color: "#1ad4ff", cursor: "pointer" }}
              />
            </Link>
          )}
          {token === "" ? (
            <Link href="/login"  className={styles.link}>
              <div className={styles.userName}>Se connecter</div>
            </Link>
          ) : (
            <Link href="/login"  className={styles.link}>
              <div className={styles.userName} onClick={() => handleLogout()}>
                Déconnexion
              </div>
            </Link>
          )}
        </div>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navbarCategories}>
          <Link href="/" className={styles.link}>
            <div className={styles.navbarCategory}>Dernières</div>
          </Link>
          <Link href="/" className={styles.link}>
            <div className={styles.navbarCategory}>Best of</div>
          </Link>
          <Link href="/categories/général" className={styles.link}>
            <div className={styles.navbarCategory}>Général</div>
          </Link>
          <Link href="/categories/scientifique" className={styles.link}>
            <div className={styles.navbarCategory}>Science</div>
          </Link>
          <Link href="/categories/technology" className={styles.link}>
            <div className={styles.navbarCategory}>Technologie</div>
          </Link>
          <Link href="/categories/adult" className={styles.link}>
            <div className={styles.navbarCategory}>Adulte</div>
          </Link>
        </div>
        <div className={styles.navBarSubmitFact}>
          <SubmitForm />
        </div>
      </nav>
    </header>
  );
}

export default Header;
