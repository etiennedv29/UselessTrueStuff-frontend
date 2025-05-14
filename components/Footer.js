import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <p>&copy; <strong>2025 UselessTrueStuff.</strong> All rights reserved.</p>
      <div className={styles.footerLinkscontainer}>
        <Link href="/legal/legal-mentions"  className={styles.link}>
          <div className={styles.footerNav}>Legal mentions</div>
        </Link>
        <Link href="/legal/confidentiality" className={styles.link}>
          <div className={styles.footerNav}>Confidentiality</div>
        </Link>
        <Link href="/legal/cookies" className={styles.link}>
          <div className={styles.footerNav}>Cookies </div>
        </Link>
        <Link href="/legal/CGU" className={styles.link}>
          <div className={styles.footerNav}>CGU</div>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
