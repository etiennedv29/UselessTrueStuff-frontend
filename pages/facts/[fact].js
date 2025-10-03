import SingleFact from "../../components/SingleFactPage";
import { apiFetch } from "../../utils/apiFetch";

function SingleFactPage({ factsData, factId }) {
  return <SingleFact factsData={factsData} factId={factId} />;
}

export default SingleFactPage;

/**
 *    On va chercher dans le serveur les infos : on lit l'id dynamiquement depuis l’URL (/fact/[fact])
 *    via context.params.fact, on fetche les données, et on les passe au composant.
 *    Ainsi, l’accès direct au singleFactPage fonctionne (pas de 404 / pas de router.query vide).
 */
export async function getServerSideProps(context) {
  try {
    const { fact } = context.params; //  l'id de l'URL (= le factId)

    const data = await apiFetch(`/facts/search?factId=${fact}`);

    if (!data || data.length === 0) {
      return { notFound: true }; // renvoie une 404 propre si le fact n’existe pas
    }

    // 🔄 On remet au format utilisé quand on avait router.query
    const factsData = data.map((fact) => ({
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

    return {
      props: {
        factsData,
        factId: fact, // Dispo côté client pour le post de commentaire
      },
    };
  } catch (e) {
    console.error("getServerSideProps error:", e);
    return { notFound: true };
  }
}
