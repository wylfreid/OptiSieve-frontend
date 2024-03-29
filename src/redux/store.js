

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import imgSlice from "./slices/imgSlice";
import resultSlice from "./slices/resultSlice";
import modelSlice from "./slices/modelSlice";


const store = configureStore({
    reducer:{
        user:userSlice,
        images: imgSlice,
        result: resultSlice,
        model: modelSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export default store;
