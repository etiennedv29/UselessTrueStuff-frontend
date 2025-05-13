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
import {logout} from "../reducers/users";
import { useRouter } from "next/router";


function Header() {
  const router = useRouter();
  const dispatch=useDispatch()
  const username = useSelector((state) => state.users.value.username);
  const token = useSelector((state) => state.users.value.token);

  const handleLogout=()=>{
    dispatch(logout())
    router.push('/')
  }

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
              style={{ cursor: "pointer" }}
            />
          </Link>
          <div className={styles.logoCatchPhrase}>
            <h1 className={styles.logoCatchPhrase}>
              True stuff you didn't know you needed
            </h1>
          </div>
        </div>
        
       
        <div className={styles.userInfoContainer}>
        {token==='' ? (
             <Link href="/login">
             <FontAwesomeIcon
           icon={faUser}
           className={styles.userImage}
           style={{ color: "#1ad4ff" ,cursor:'pointer'}}
         />
           </Link>
          ) : (
            <Link href="/account">
              <FontAwesomeIcon
            icon={faUser}
            className={styles.userImage}
            style={{ color: "#1ad4ff" ,cursor:'pointer'}}
          />
            </Link>
          )}
          {token==='' ? (
            <Link href="/login">
              <div className={styles.userName}>Login</div>
            </Link>
          ) : (
            <Link href="/login">
              <div className={styles.userName} onClick={()=>handleLogout()}>Logout</div>
            </Link>
          )}
        </div>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navbarCategories}>
          <Link href="/">
            <div className={styles.navbarCategory}>Latest</div>
          </Link>
          <Link href="/">
            <div className={styles.navbarCategory}>Best of</div>
          </Link>
          <Link href="/categories/général">
            <div className={styles.navbarCategory}>General</div>
          </Link>
          <Link href="/categories/scientifique">
            <div className={styles.navbarCategory}>Scientific</div>
          </Link>
          <Link href="/categories/technology">
            <div className={styles.navbarCategory}>Technology</div>
          </Link>
          <Link href="/categories/adult">
            <div className={styles.navbarCategory}>Adult</div>
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
