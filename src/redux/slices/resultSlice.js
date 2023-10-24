import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sample_name: "",
  result: [],
};

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResult: (state, action) => {
      state.sample_name = action.payload[0];
      state.result = action.payload[1];
    },
  },
});

export const resultActions = resultSlice.actions;

export default resultSlice.reducer;
