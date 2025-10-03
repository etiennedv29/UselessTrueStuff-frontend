import { store } from "../store";
import { refreshAccessToken, logout } from "../reducers/users";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

export async function apiFetch(endpoint, options = {}) {
  // ✅ Détecte si on est côté serveur (SSR)
  const isServer = typeof window === "undefined";

  let accessToken, refreshToken, email;
  if (!isServer) {
    const state = store.getState();
    ({ accessToken, refreshToken, email } = state.users.value || {});
  }

  // 1️⃣ Prépare les headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!isServer && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // 2️⃣ Lance la requête initiale
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3️⃣ Si token expiré → tente un refresh (uniquement côté client)
  if (!isServer && response.status === 401 && refreshToken) {
    console.log("⚠️ Access token expiré, tentative de refresh...");

    const refreshResponse = await fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();

      // 4️⃣ Mise à jour du store Redux
      store.dispatch(
        refreshAccessToken({
          accessToken: refreshData.accessToken,
          accessTokenExpirationDate: refreshData.accessTokenExpirationDate,
        })
      );

      // 5️⃣ Rejoue la requête initiale avec le nouveau token
      const newHeaders = {
        ...headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      };

      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: newHeaders,
      });
    } else {
      // Refresh échoué → on déconnecte
      console.warn("❌ Refresh token invalide ou expiré, logout forcé.");
      store.dispatch(logout());
      return Promise.reject({ error: "Session expirée, reconnecte-toi." });
    }
  }

  // 6️⃣ Retour final : JSON déjà parsé
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw { status: response.status, ...errorBody };
  }

  return response.json();
}
