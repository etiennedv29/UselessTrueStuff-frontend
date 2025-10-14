import Fact from "./Fact";
import Login from "./Login";
import Head from "next/head";
import { message } from "antd";
import Modal from "antd/lib/modal";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setUserData, logout } from "../reducers/users";
import { useRouter } from "next/router"; //récupération de l'url
import InfiniteScroll from "react-infinite-scroll-component"; //pour le chargement au fur et à mesure
import { apiFetch } from "../utils/apiFetch"; // le wrapper de fetch pour la gestion des accessToken et refreshToken à chaque appel fetch

function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state=> state.users.value)
  const [factsData, setFactsData] = useState([]);
  const [hasMore, setHasMore] = useState(true); //loading progressif des facts
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);

  // Refs pour éviter les courses et fiabiliser l'offset
  const offsetRef = useRef(0);
  const isLoadingRef = useRef(false);
  const knownIdsRef = useRef(new Set()); // déduplication
  const hasMoreRef = useRef(true); // <- miroir de hasMore pour éviter la closure périmée
  const LIMIT = 20;

  //useEffect pour mettre à jour les infos utilisateurs au chargement
  useEffect(() => {
    //console.log("useEffect de syncUserData");
    const syncUserData = async () => {
      try {
        //S'il n'y a pas d'acessToken en reducer, alors l'utilisateur est forcément un visiteur (ou un logged out)
        //ancien code : const state = store.getState();
        //ancien code : const token = state.users?.value?.accessToken;
        //nouveau code : 
        const token = user?.accessToken
        if (!token) {
          console.log("Aucun utilisateur connecté, skip de /users/me");
          return; // évite l'appel pour les visiteurs ou loggedout
        }
        const data = await apiFetch("/users/me", { method: "GET" });
        //console.log("userData sync:", data);
        dispatch(setUserData(data));
      } catch (error) {
        console.warn(
          "Impossible de synchroniser les données utilisateur :",
          error
        );

        // Si le token est invalide ou expiré → déconnexion et modale de login
        if (
          error?.error === "Session expirée, reconnecte-toi." ||
          error?.error?.includes("non correspondant") ||
          error?.status === 401
        ) {
          message.warning("Session expirée, reconnecte-toi !");
          dispatch(logout());
          setVisibleModalLogin(true);
        }
      }
    };
    syncUserData();
  }, [dispatch, user?.accessToken]);

  //ouverture et fermeture de la modal Login
  function changeModalState() {
    setVisibleModalLogin(!visibleModalLogin);
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 300); // petit délai pour fermer proprement la modale
    }
  }

  // Fonction pour charger les facts (20 par 20)
  const loadMoreFacts = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return; // Évite les appels multiples
    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("offset", String(offsetRef.current));
      params.set("limit", String(LIMIT));
      if (router?.query?.type) {
        // ne pas double-encoder : URLSearchParams s'en charge
        params.set("tags", String(router.query.type));
      }

      const data = await apiFetch(`/facts/search?${params.toString()}`, {
        method: "GET",
      });

      const array = Array.isArray(data) ? data : [];

      // Formatage des données (comme dans votre code original)
      const pageFacts = array.map((fact) => ({
        factTitle: fact.title,
        factDescription: fact.description,
        factAuthor: fact.userID,
        factSubmittedAt: fact.submittedAt,
        nbVotesPlus: fact.votePlus,
        nbVotesMinus: fact.voteMinus,
        factComments: fact.comments,
        factImage: fact.image,
        factId: fact._id,
      }));

      // Déduplication : on garde seulement les nouveaux IDs
      const uniqueNew = pageFacts.filter((f) => {
        if (!f.factId) return true; // sécurité si pas d'id
        if (knownIdsRef.current.has(f.factId)) return false;
        knownIdsRef.current.add(f.factId);
        return true;
      });

      setFactsData((prev) => [...prev, ...uniqueNew]);
      // Avancer l'offset d'après ce que l'API a réellement renvoyé
      offsetRef.current += array.length;

      // Conditions d'arrêt
      const shouldStop = array.length === 0 || array.length < LIMIT;
      hasMoreRef.current = !shouldStop; // maj REF d'abord
      setHasMore(!shouldStop); // puis l'état (pour InfiniteScroll)
    } catch (error) {
      console.error("Erreur lors du chargement des facts :", error);
      // On laisse hasMore tel quel pour permettre un retry au scroll
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
    // NE PAS dépendre de hasMore ici (on lit la ref). On dépend seulement du tag.
  }, [router?.query?.type]);

  // Charger les 20 premiers facts au montage ou quand le filtre change
  useEffect(() => {
    if (!router.isReady) return;
    // Reset propre (state + refs)
    setFactsData([]);
    setHasMore(true);
    hasMoreRef.current = true; // <- très important pour éviter l'alternance oui/non
    offsetRef.current = 0;
    isLoadingRef.current = false;
    knownIdsRef.current = new Set();

    // Premier chargement après un court délai
    const timer = setTimeout(() => {
      loadMoreFacts();
    }, 100);

    return () => clearTimeout(timer);
  }, [router.isReady, router.query.type, loadMoreFacts]);

  return (
    <div>
      <Modal
        getContainer="#react-modals"
        open={visibleModalLogin}
        closable={true}
        footer={null}
        onCancel={() => setVisibleModalLogin(null)}
        width={500}
        className="modal"
      >
        {visibleModalLogin && <Login changeVisibleModal={changeModalState} />}
      </Modal>
      <Head>
        <title>UselessTrueStuff - Home</title>
      </Head>

      <div className="w-full flex justify-between bg-[#0b0c1a]">
        <div className="w-0 md:w-1/5 bg-gray-500 ad-slot"></div>

        {/* 
          Variante conteneur scrollable : remets un div avec id et style={{ height: `calc(100vh - 80px)`, overflow: 'auto' }}
          puis passe scrollableTarget="scrollableDiv" à <InfiniteScroll />.
        */}
        <div className="w-full md:w-3/5 p-5 flex flex-col justify-center gap-4">
          <InfiniteScroll
            key={String(router?.query?.type ?? "all")} // reset propre quand le filtre change
            dataLength={factsData.length}
            next={loadMoreFacts}
            hasMore={hasMore}
            loader={<p className="text-center py-4">Chargement...</p>}
            // Pas de scrollableTarget => écoute le scroll de la fenêtre
            scrollThreshold="200px"
            endMessage={
              <p className="text-center py-4">
                <b>Vous avez tout vu !</b>
              </p>
            }
          >
            {factsData.map((fact) => (
              <Fact
                key={fact.factId || `${fact.factTitle}-${fact.factSubmittedAt}`}
                {...fact}
              />
            ))}
          </InfiniteScroll>
        </div>

        <div className="w-0 md:w-1/5 bg-gray-500 ad-slot"></div>
      </div>
    </div>
  );
}

export default Home;
