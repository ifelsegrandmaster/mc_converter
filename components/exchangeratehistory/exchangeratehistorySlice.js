import { createSlice } from "@reduxjs/toolkit";
import getCurrenciesHistoricalData from "./utils";

const exchangeratehistorySlice = createSlice({
    name: 'exchangeratehistory',
    initialState: {
        history: [],
        loading: false,
        error: null
    },
    reducers: {
        fetchHistoricalDataBegin: (state) => {
            state.loading = true;
        },
        fetchHistoricalDataSucces: (state, action) => {
            state.history = action.payload;
            state.loading = false;
        },
        fetchHistoricalDataFailure: (state, action) => {
            state.error = action.payload;
        },
        addToHistoricalData: (state, action) => {
            state.history.unshift(action.payload);
        },
    }
});

// Actions are automatically created
export const {
    addToHistoricalData,
    fetchHistoricalDataBegin,
    fetchHistoricalDataSucces,
    fetchHistoricalDataFailure
} = exchangeratehistorySlice.actions;

// Fetch history data
export const fetchHistoricalData = (currencies) => dispatch => {
    dispatch(fetchHistoricalDataBegin());

    // get currencies historical data
    getCurrenciesHistoricalData(currencies).then(data => {
        dispatch(fetchHistoricalDataSucces(data))
    }).catch(error => {
        const message = error.message;
        const name = error.name;
        dispatch({ name, message });
    })
}


export default exchangeratehistorySlice.reducer;