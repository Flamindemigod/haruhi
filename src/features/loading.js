import { createSlice } from "@reduxjs/toolkit";


export const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        value: false,
        
    },
    reducers: {
        setLoading: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const {setLoading} = loadingSlice.actions;

export default loadingSlice.reducer;