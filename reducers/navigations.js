import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { loginOrigin: "",nextPage:"" },
};

export const navigationsSlice = createSlice({
  name: "navigations",

  initialState,
  reducers: {
    rememberOrigin: (state, action) => {
      state.value.loginOrigin = action.payload;
    },
  },
});

export const { rememberOrigin } = navigationsSlice.actions;
export default navigationsSlice.reducer;
