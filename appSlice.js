import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        currencies: [],
        loading: false,
        error: null
    },
    reducers: {
        fetchCodesSuccess: (state, action) => {
            state.currencies = action.payload;
            state.loading = false;
        },
        fetchCodesBegin: (state) => {
            state.loading = true;
        },
        fetchCodesFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

// Action creators are generated for each case reducer function
export const { fetchCodesSuccess, fetchCodesBegin, fetchCodesFailure } = appSlice.actions;

export const fetchCodes = url => dispatch => {
    dispatch(fetchCodesBegin())
    axios.get(url).then(response => {
        currencies = response.data.supported_codes;
        dispatch(fetchCodesSuccess(currencies));
    }).catch(error => {
        const data = error.response.data;
        const status = error.response.status;
        dispatch(fetchCodesFailure({ status, data }))
    })
}

export default appSlice.reducer;