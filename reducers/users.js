import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    _id: null,
    token: null,
    username: null,
    firstName: null,
    votePlus: null,
    voteMinus: null,
  },
};

export const usersSlice = createSlice({
  name: "users",

  initialState,
  reducers: {
    login: (state, action) => {
      state.value._id = action.payload._id;
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.firstName = action.payload.firstName;
      state.value.votePlus = action.payload.votePlus;
      state.value.voteMinus = action.payload.voteMinus;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.username = null;
      state.value.firstName = null;
      state.value._id = null;
      state.value.voteMinus = null;
      state.value.votePlus = null;
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
  },
});

export const { login, logout, addUserVote, removeUserVote } =
  usersSlice.actions;
export default usersSlice.reducer;
