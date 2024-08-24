import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("auth") ? 
JSON.parse(localStorage.getItem("auth")) : {userInfo: null};

const userSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.userInfo = action.payload;
            localStorage.setItem("auth", JSON.stringify(state));
        },
        deleteCredentials(state) {
            state.userInfo = null;
            localStorage.removeItem("auth");
        }
    }
});

export const { setCredentials, deleteCredentials } = userSlice.actions;
export default userSlice.reducer;
