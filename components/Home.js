import styles from "../styles/Home.module.css";
import Fact from "./Fact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";

function Home() {
  const [factsData, setFactsData] = useState([]);

  // const factsToDisplay = [
  //   {
  //     userID: "user1",
  //     title: "Les bananes sont légèrement radioactives",
  //     description:
  //       "Les bananes contiennent une petite quantité de potassium-40, un isotope radioactif.",
  //     category: "Science",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:00:00Z",
  //     validatedAt: "2023-10-02T12:00:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/banana.jpg",
  //   },
  //   {
  //     userID: "user2",
  //     title: "Un jour sur Vénus est plus long qu'une année sur Vénus",
  //     description:
  //       "Vénus met environ 243 jours terrestres à tourner sur elle-même, mais seulement 225 jours pour orbiter autour du Soleil.",
  //     category: "Astronomie",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:05:00Z",
  //     validatedAt: "2023-10-02T12:05:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/venus.jpg",
  //   },
  //   {
  //     userID: "user3",
  //     title: "Les hippopotames transpirent du sang",
  //     description:
  //       "Les hippopotames sécrètent une substance rouge qui ressemble à du sang, mais qui est en réalité un fluide protecteur contre le soleil.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:10:00Z",
  //     validatedAt: "2023-10-02T12:10:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/hippo.jpg",
  //   },
  //   {
  //     userID: "user4",
  //     title: "Les flamants roses sont roses à cause de leur alimentation",
  //     description:
  //       "Les flamants roses obtiennent leur couleur rose grâce aux caroténoïdes présents dans les crevettes et les algues qu'ils mangent.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:15:00Z",
  //     validatedAt: "2023-10-02T12:15:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/flamingo.jpg",
  //   },
  //   {
  //     userID: "user5",
  //     title: "Le miel ne se périme jamais",
  //     description:
  //       "Grâce à ses propriétés antibactériennes et à sa faible teneur en eau, le miel peut se conserver indéfiniment.",
  //     category: "Alimentation",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:20:00Z",
  //     validatedAt: "2023-10-02T12:20:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/honey.jpg",
  //   },
  //   {
  //     userID: "user6",
  //     title: "Les étoiles de mer n'ont pas de cerveau",
  //     description:
  //       "Les étoiles de mer utilisent un système nerveux décentralisé pour coordonner leurs mouvements et leurs actions.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:25:00Z",
  //     validatedAt: "2023-10-02T12:25:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/starfish.jpg",
  //   },
  //   {
  //     userID: "user7",
  //     title: "Les fourmis ne dorment jamais",
  //     description:
  //       "Les fourmis prennent de courtes périodes de repos, mais elles n'ont pas de cycle de sommeil comme les humains.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:30:00Z",
  //     validatedAt: "2023-10-02T12:30:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/ant.jpg",
  //   },
  //   {
  //     userID: "user8",
  //     title: "Les pingouins ont des genoux",
  //     description:
  //       "Les genoux des pingouins sont situés plus haut sur leur corps, ce qui leur donne une démarche unique.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:35:00Z",
  //     validatedAt: "2023-10-02T12:35:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/penguin.jpg",
  //   },
  //   {
  //     userID: "user9",
  //     title: "Les nuages les plus hauts se trouvent sur Vénus",
  //     description:
  //       "Les nuages de Vénus sont composés d'acide sulfurique et se trouvent à environ 60 km au-dessus de la surface.",
  //     category: "Astronomie",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:40:00Z",
  //     validatedAt: "2023-10-02T12:40:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/venus_clouds.jpg",
  //   },
  //   {
  //     userID: "user10",
  //     title: "Les koalas ont des empreintes digitales",
  //     description:
  //       "Les empreintes digitales des koalas sont si similaires à celles des humains qu'elles peuvent être confondues.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:45:00Z",
  //     validatedAt: "2023-10-02T12:45:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/koala.jpg",
  //   },
  //   {
  //     userID: "user11",
  //     title: "Les escargots peuvent dormir pendant trois ans",
  //     description:
  //       "Certains escargots peuvent entrer en hibernation et dormir pendant plusieurs années.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:50:00Z",
  //     validatedAt: "2023-10-02T12:50:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/snail.jpg",
  //   },
  //   {
  //     userID: "user12",
  //     title: "Les carottes étaient à l'origine violettes",
  //     description:
  //       "Les premières carottes cultivées étaient violettes ou blanches. Les carottes orange ont été développées plus tard par les Néerlandais.",
  //     category: "Alimentation",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T12:55:00Z",
  //     validatedAt: "2023-10-02T12:55:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/carrot.jpg",
  //   },
  //   {
  //     userID: "user13",
  //     title: "Les chauves-souris sont les seuls mammifères capables de voler",
  //     description:
  //       "Bien que d'autres mammifères puissent planer, les chauves-souris sont les seules capables de voler activement.",
  //     category: "Animaux",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T13:00:00Z",
  //     validatedAt: "2023-10-02T13:00:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/bat.jpg",
  //   },
  //   {
  //     userID: "user14",
  //     title: "Les cacahuètes ne sont pas des noix",
  //     description:
  //       "Les cacahuètes sont en réalité des légumineuses et poussent sous terre.",
  //     category: "Alimentation",
  //     votePlus: 0,
  //     voteMinus: 0,
  //     comments: [],
  //     submittedAt: "2023-10-01T13:05:00Z",
  //     validatedAt: "2023-10-02T13:05:00Z",
  //     trueRatio: 1.0,
  //     status: "validated",
  //     image: "https://example.com/peanut.jpg",
  //   },
  // ];

  async function getFacts() {
    let response = await fetch(`http://localhost:3000/facts/`);
    let data = await response.json();
    //console.log(data)
    let newFactsData = data.map((fact) => {
      const newFactFormat = {
        factTitle: fact.title,
        factDescription: fact.description,
        nbVotesPlus: fact.votePlus,
        nbVotesMinus: fact.voteMinus,
        factComments: fact.comments,
        factImage: fact.image,
      };
      return newFactFormat;
    });
    setFactsData(newFactsData);
  }

  useEffect(() => {
    getFacts();
  }, []);

  let facts = factsData.map((data, i) => {
    return <Fact key={i} {...data} />;
  });

  return (
    <div>
      <Head>
        <title>Useless True Stuff - Home</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.globalInfo}>
          <div className={styles.logoContainer}>
            <Image
              className={styles.logoImage}
              src="/uselessTrueStuff_logo.jpg"
              alt="UselessTrueStuff logo"
              width={133}
              height={100}
            />
            <div className={styles.logoCatchPhrase}>
              True stuff you didn't know you needed
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
            <div className={styles.navbarCategory}>Catégorie 1</div>
            <div className={styles.navbarCategory}>Catégorie 2</div>
            <div className={styles.navbarCategory}>Catégorie 3</div>
            <div className={styles.navbarCategory}>Catégorie 4</div>
          </div>
          <div className={styles.navBarSubmitFact}>
            Submit Fact! 

          </div>
        </navbar>
      </header>

      <div className={styles.mainContainer}>
        <div className={styles.mainPublicity}></div>
        <div className={styles.factsContainer}>{facts}</div>
        <div className={styles.mainPublicity}></div>
      </div>
    </div>
  );
}

export default Home;
