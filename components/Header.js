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
import { apiFetch } from "../utils/apiFetch";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.users.value.username);
  const accessToken = useSelector((state) => state.users.value.accessToken);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalSubmitFact, setVisibleModalSubmitFact] = useState(false);
  const [topCategoriesFromBack, setTopCategoriesFromBack] = useState([]);

  const handleLogout = async () => {
    await router.push("/");
    dispatch(logout());
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
      const topCategoriesResponse = await apiFetch("/facts/topTags", {
        method: "GET",
      });
      return topCategoriesResponse;
    } catch (error) {
      console.log("Erreur lors de la récupération des top catégories", error);
      return [];
    }
  };

  const topCategoriesToDisplay = topCategoriesFromBack.map((cat, i) => {
    return (
      <Link
        href={`/categories/${cat}`}
        key={i}
        className="no-underline text-inherit"
      >
        <div className="hidden sm:flex mr-1 lg:mr-1.5 ml-1 lg:ml-1.5 cursor-pointer h-5 md:h-7 flex-row items-center text-center rounded-sm text-[#1ad4ff] hover:text-[#0b0c1a] text-sm md:text-base bg-[#0b0c1a] hover:bg-[#1ad4ff]">
          {cat}
        </div>
      </Link>
    );
  });

  return (
    <header className="w-full h-auto flex flex-col justify-between sticky top-0 items-center bg-[#0b0c1a] z-1000">
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

      <div className="h-auto w-full flex justify-between items-center pr-2">
        <div className="flex items-center h-full ml-2">
          <Link href="/" className="no-underline text-inherit">
            <Image
              className="h-full aspect-auto min-w-[90px]"
              src="/uselessTrueStuff_logo.jpg"
              alt="UselessTrueStuff logo"
              width={133}
              height={100}
              style={{ cursor: "pointer" }}
            />
          </Link>
          <Link href="/" className="no-underline text-inherit">
            <h1 className="text-[#1ad4ff] ml-1 text-xl lg:text-2xl hidden sm:block">
              Des trucs vrais et pas toujours utiles
            </h1>
          </Link>
        </div>

        <div className="flex justify-around text-[#1ad4ff] flex-row gap-1">
          {!accessToken ? (
            <FontAwesomeIcon
              icon={faUser}
              className="aspect-auto h-[20px]"
              style={{ color: "#1ad4ff", cursor: "pointer" }}
              onClick={() => setVisibleModalLogin(!visibleModalLogin)}
            />
          ) : (
            <div className="flex justify-around text-[#1ad4ff] gap-1 w-auto items-baseline">
              <Link href="/account" className="no-underline text-inherit">
                <FontAwesomeIcon
                  icon={faUser}
                  className="aspect-auto h-[20px]"
                  style={{ color: "#1ad4ff", cursor: "pointer" }}
                />
              </Link>
              <div className="cursor-pointer" onClick={() => handleLogout()}>
                Déconnexion
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="w-full h-auto flex flex-row items-center justify-between pl-8 pr-2 pb-2 shadow-md shadow-gray-500">
        <div className="flex flex-wrap justify-center text-center">
          <Link href="/" className="no-underline text-inherit">
            <div className="mr-1 lg:mr-1.5 ml-1 lg:ml-1.5 cursor-pointer h-5 md:h-7 flex flex-row items-center text-center rounded-sm text-[#1ad4ff] hover:text-[#0b0c1a] text-sm md:text-base bg-[#0b0c1a] hover:bg-[#1ad4ff]">
              Dernières
            </div>
          </Link>
          {topCategoriesToDisplay}
        </div>

        <div
          className="h-auto w-auto flex flex-row justify-center items-center text-center border-1 text-[#0b0c1a] bg-[#1ad4ff] rounded-md hover:text-[#1ad4ff] hover:bg-[#0b0c1a] cursor-pointer px-2 sm:px-4 py-0.5 font-medium sm:font-bold"
          onClick={
            accessToken ? changeModalStateSubmitFact : changeModalStateLogin
          }
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
