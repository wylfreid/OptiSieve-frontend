import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classification_model: null,
  regression_model: null,
};

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setResult: (state, action) => {
      state.classification_model = action.payload?.classification_model;
      state.regression_model = action.payload?.regression_model;
    },
  },
});

export const modelActions = modelSlice.actions;

export default modelSlice.reducer;
