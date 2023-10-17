import { createSlice } from "@reduxjs/toolkit";

const initialState = null

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
