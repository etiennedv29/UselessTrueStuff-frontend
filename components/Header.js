import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import SubmitForm from "./SubmitForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.globalInfo}>
        <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            className={styles.logoImage}
            src="/uselessTrueStuff_logo.jpg"
            alt="UselessTrueStuff logo"
            width={133}
            height={100}
            style={{cursor:'pointer'}}
          />
          </Link>
          <div className={styles.logoCatchPhrase}>
            <h1 className={styles.logoCatchPhrase}>True stuff you didn't know you needed</h1>
          </div>
        </div>
        <div className={styles.userInfoContainer}>
          <FontAwesomeIcon
            icon={faUser}
            className={styles.userImage}
            style={{ color: "#1ad4ff" }}
          />
          <div className={styles.userName}>Etienne</div>
        </div>
      </div>
      <navbar className={styles.navbar}>
        <div className={styles.navbarCategories}>
        <Link href="/">
          <div className={styles.navbarCategory}>Latest</div>
          </Link>
          <Link href="/">
          <div className={styles.navbarCategory}>Top 100</div>
          </Link>
          <Link href="/categories/général">
            <div className={styles.navbarCategory}>Général</div>
          </Link>
          <Link href="/categories/scientifique">
          <div className={styles.navbarCategory}>Scientifique</div>
          </Link>
          <Link href="/categories/category3">
          <div className={styles.navbarCategory}>Catégorie 3</div>
          </Link>
          <Link href="/categories/category4">
          <div className={styles.navbarCategory}>Catégorie 4</div>
          </Link>
        </div>
        <div className={styles.navBarSubmitFact}>
          <SubmitForm />
        </div>
      </navbar>
    </header>
  );
}

export default Header;
