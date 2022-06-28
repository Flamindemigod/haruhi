import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: "user",
    initialState: {
        value: {
            userAuth: false,
            userName: "",
            userAvatar: "",
            userToken:""
        }
    },
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        },
        unsetUser: (state, action) => {
            state.value = {
                userAuth: false,
                userName: "",
                userAvatar: "",
                userToken:""
            };
        },
    }
});

export const {setUser, unsetUser} = userSlice.actions;

export default userSlice.reducer;