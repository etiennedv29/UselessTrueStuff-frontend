import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//reducers
import users from "./reducers/users";
import facts from "./reducers/facts"; // si tu as un reducer facts

const reducers = combineReducers({
  users,
  facts,
});

const persistConfig = { key: "UselessTrueStuff", storage };

// persistor redux
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export { store, persistor };
