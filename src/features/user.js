import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: "user",
    initialState: {
        value: {
            userAuth: false,
            userName: "",
            userID: 0,
            userAvatar: "",
            userToken: "",
            userPreferenceShowEndDialog: false,
            userPreferenceSkipOpening: 85,
            userPreferenceDubbed: false,
            userPreferenceEpisodeUpdateTreshold: 0.9,
        }
    },
    reducers: {
        setUser: (state, action) => {
            state.value = { ...state.value, ...action.payload };
            localStorage.setItem("UserPrefEpisodeTreshold", state.value.userPreferenceEpisodeUpdateTreshold)
            localStorage.setItem("UserPrefSkipOpening", state.value.userPreferenceSkipOpening)
            localStorage.setItem("UserPrefShowEndDialog", state.value.userPreferenceShowEndDialog)
            localStorage.setItem("UserPrefDubbed", state.value.userPreferenceDubbed)

        },
        unsetUser: (state, action) => {
            state.value = {
                userAuth: false,
                userName: "",
                userID: 0,
                userAvatar: "",
                userToken: "",
                userPreferenceShowEndDialog: false,
                userPreferenceSkipOpening: 85,
                userPreferenceSubbed: false,
                userPreferenceEpisodeUpdateTreshold: 0.9,
                
            };
            localStorage.setItem("UserPrefEpisodeTreshold", state.value.userPreferenceEpisodeUpdateTreshold)
            localStorage.setItem("UserPrefSkipOpening", state.value.userPreferenceSkipOpening)
            localStorage.setItem("UserPrefShowEndDialog", state.value.userPreferenceShowEndDialog)
            localStorage.setItem("UserPrefDubbed", state.value.userPreferenceDubbed)
        },
    }
});

export const { setUser, unsetUser } = userSlice.actions;

export default userSlice.reducer;