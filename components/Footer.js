import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.SEOText}>
        <strong>UselessTrueStuff : Des faits inutiles mais fascinants à découvrir et
        partager</strong> 
        Bienvenue sur UselessTrueStuff, votre nouvelle source de faits
        inutiles mais incroyablement intéressants ! 
        Chaque jour, nous vous offrons une sélection de faits étonnants qui ne changeront peut-être pas
        votre quotidien, mais qui égayeront certainement vos conversations. Que
        vous soyez à la recherche d'un fait surprenant à partager ou d'une
        anecdote curieuse, vous êtes au bon endroit. 
        <br /><br />
        <strong>Des faits à partager avec
        vos amis</strong> <br />
        UselessTrueStuff vous propose des faits fascinants, allant des
        découvertes scientifiques improbables aux curiosités culturelles souvent
        méconnues. Chaque fait est soigneusement vérifié pour garantir qu'il
        soit à la fois vrai et divertissant. De quoi ravir vos amis et égayer
        vos discussions ! 
        <br /><br />
        <strong>Interaction sociale : commentez et votez pour vos
        faits préférés</strong> <br />
        Sur UselessTrueStuff, l'expérience ne se limite pas à la
        lecture de faits. Vous pouvez commenter chaque fait, donner votre avis,
        et échanger avec les autres utilisateurs. Vous avez aussi la possibilité
        de voter pour vos faits préférés : un like pour ceux que vous trouvez
        particulièrement intéressants et un dislike pour ceux qui vous
        paraissent moins pertinents. Cette interaction enrichit l'expérience en
        permettant à chacun de participer activement. Alors, n’hésitez pas à
        vous exprimer et à faire découvrir aux autres ce que vous avez trouvé de
        plus fascinant ! 
        <br /><br />
        <strong>Pourquoi visiter UselessTrueStuff ?</strong> <br />Des faits fiables
        et amusants : Chaque fait publié est minutieusement vérifié pour
        garantir sa véracité tout en restant divertissant. Parfait pour
        impressionner vos amis avec des connaissances inédites ! Une expérience
        interactive : Commentaires, votes, échanges… Sur UselessTrueStuff,
        chaque fait devient une occasion de discuter et de partager vos points
        de vue avec la communauté. Des mises à jour quotidiennes : Nous ajoutons
        régulièrement de nouveaux faits pour que vous n'ayez jamais à chercher
        longtemps une nouvelle curiosité à découvrir. Un site optimisé pour tous
        les appareils : Facile à naviguer, UselessTrueStuff s’adapte à vos
        appareils : téléphone, tablette ou ordinateur. Vous pouvez ainsi
        consulter nos faits en toute simplicité, où que vous soyez. 
        <br /><br />
        <strong>Une plateforme pour les curieux </strong><br />
        Que vous soyez un passionné de trivia, un
        amateur de culture générale, ou simplement quelqu'un de curieux,
        UselessTrueStuff est fait pour vous. Chaque fait est une nouvelle
        occasion de découvrir le monde sous un angle original et amusant, tout
        en échangeant avec d'autres curieux.
      </div>
      <p>
        <strong>2025 UselessTrueStuff.</strong> Tous droits réservés.
      </p>
      <div className={styles.footerLinkscontainer}>
        <Link href="/legal/legal-mentions" className={styles.link}>
          <div className={styles.footerNav}>Mentions légales</div>
        </Link>
        <Link href="/legal/confidentiality" className={styles.link}>
          <div className={styles.footerNav}>Confidentialité</div>
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
