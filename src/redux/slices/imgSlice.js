import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const imgSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addImages: (state, action) => {
      return action.payload;
    },

    deleteImages: (state, action) => {
      return [];
    },
  },
});

export const imgActions = imgSlice.actions;

export default imgSlice.reducer;
