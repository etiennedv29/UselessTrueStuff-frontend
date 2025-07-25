import styles from "../styles/Home.module.css";
import SubmitForm from "./SubmitForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/users";
import { useRouter } from "next/router";
import Modal from "antd/lib/modal";
import Login from "./Login";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.users.value.username);
  const token = useSelector((state) => state.users.value.token);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalSubmitFact, setVisibleModalSubmitFact] = useState(false);
  const [topCategoriesFromBack, setTopCategoriesFromBack] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  function changeModalStateLogin() {
    setVisibleModalLogin(!visibleModalLogin);
  }

  function changeModalStateSubmitFact() {
    setVisibleModalSubmitFact(!visibleModalSubmitFact);
  }

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const topCategoriesFromBackRaw = await getTopTags();

        setTopCategoriesFromBack(topCategoriesFromBackRaw);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTopCategories();
  }, []);

  const getTopTags = async () => {
    try {
      const topCategoriesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/facts/topTags`
      );
      if (!topCategoriesResponse.ok) {
        throw new Error(`Erreur HTTP : ${topCategoriesResponse.status}`);
      }
      const topCategoriesRaw = await topCategoriesResponse.json();
      return topCategoriesRaw;
    } catch (error) {
      console.log("Erreur lors de la récupérationd des top catégories", error);
      return [];
    }
  };

  const topCategoriesToDisplay = topCategoriesFromBack.map((cat, i) => {
    return (
      <Link href={`/categories/${cat}`} key={i} className={styles.link}>
        <div className={styles.navbarCategory}>{cat}</div>
      </Link>
    );
  });

  return (
    <header className={styles.header}>
      <Modal
        getContainer="#react-modals"
        open={visibleModalLogin}
        closable={false}
        footer={null}
        keyboard={true}
        maskClosable={true}
        onCancel={changeModalStateLogin}
        width={500}
        className="modal"
      >
        <Login changeVisibleModal={changeModalStateLogin} />
      </Modal>
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
          <Link href="/" className={styles.link}>
            <div className={styles.logoCatchPhrase}>
              <h1 className={styles.logoCatchPhrase}>
                Des trucs vrais mais vraiment inutiles
              </h1>
            </div>
          </Link>
        </div>
        <div className={styles.userInfoContainer}>
          {!token ? (
            <FontAwesomeIcon
              icon={faUser}
              className={styles.userImage}
              style={{ color: "#1ad4ff", cursor: "pointer" }}
              onClick={() => setVisibleModalLogin(!visibleModalLogin)}
            />
          ) : (
            <div className={styles.userInfoContainer}>
              <Link href="/account" className={styles.link}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={styles.userImage}
                  style={{ color: "#1ad4ff", cursor: "pointer" }}
                />
              </Link>
              <div className={styles.userName} onClick={() => handleLogout()}>
                Déconnexion
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.navbarCategories}>
          <Link href="/" className={styles.link}>
            <div className={styles.navbarCategory}>Dernières</div>
          </Link>
          {topCategoriesToDisplay}
        </div>
        <div
          className={styles.navBarSubmitFact}
          onClick={token ? changeModalStateSubmitFact : changeModalStateLogin}
        >
          Proposer une info
        </div>
        <Modal
          getContainer="#react-modals"
          open={visibleModalSubmitFact}
          closable={false}
          footer={null}
          keyboard={true}
          maskClosable={true}
          onCancel={changeModalStateSubmitFact}
          width={500}
          className="modal"
        >
          <SubmitForm changeVisibleModal={changeModalStateSubmitFact} />
        </Modal>
      </nav>
    </header>
  );
}

export default Header;
