import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    _id: null,
    accessToken: null,
    accessTokenExpirationDate: null,
    refreshToken: null,
    refreshTokenExpirationDate: null,
    username: null,
    firstName: null,
    votePlus: null,
    voteMinus: null,
    email: null,
    connectionWithSocials: null,
    factsSubmitted: null,
    preferences: null,
  },
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value._id = action.payload._id;
      state.value.accessToken = action.payload.accessToken;
      state.value.accessTokenExpirationDate =
        action.payload.accessTokenExpirationDate;
      state.value.refreshToken = action.payload.refreshToken;
      state.value.refreshTokenExpirationDate =
        action.payload.refreshTokenExpirationDate;
      state.value.username = action.payload.username;
      state.value.firstName = action.payload.firstName;
      state.value.votePlus = action.payload.votePlus;
      state.value.voteMinus = action.payload.voteMinus;
      state.value.email = action.payload.email;
      state.value.connectionWithSocials = action.payload.connectionWithSocials;
      state.value.factsSubmitted = action.payload.factsSubmitted;
      state.value.preferences = action.payload.preferences;
    },

    logout: (state) => {
      state.value = { ...initialState.value };
    },

    addUserVote: (state, action) => {
      if (
        !state.value[action.payload.voteType]?.includes(action.payload.factId)
      ) {
        state.value[action.payload.voteType]?.push(action.payload.factId);
      }
    },

    removeUserVote: (state, action) => {
      state.value[action.payload.voteType] = state.value[
        action.payload.voteType
      ].filter((id) => id !== action.payload.factId);
    },

    refreshAccessToken: (state, action) => {
      state.value.accessToken = action.payload.accessToken;
      state.value.accessTokenExpirationDate =
        action.payload.accessTokenExpirationDate;
    },
    setUserData : (state,action)=>{
      state.value = {...state.value, ...action.payload}
    }
   },
});

export const {
  login,
  logout,
  addUserVote,
  removeUserVote,
  refreshAccessToken,
  setUserData
} = usersSlice.actions;
export default usersSlice.reducer;
