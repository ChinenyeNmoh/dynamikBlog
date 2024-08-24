import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./slices/authSlice";
import postSliceReducer from "./slices/postSlice";

const store = configureStore({
    reducer: {
        auth: userSliceReducer,
        post: postSliceReducer,
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: true,
})

export default store;