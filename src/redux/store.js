

import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import imgSlice from "./slices/imgSlice";


const store = configureStore({
    reducer:{
        user:userSlice,
        images: imgSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export default store;
