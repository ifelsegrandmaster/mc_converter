import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getCurrenciesRates from "./utils";
import { AsyncStorage } from "react-native";
import { API_KEY } from "@env";
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        currencies: [],
        currenciesRates: {},
        loading: false,
        loadingCurrenciesRates: false,
        history: {},
        errors: []
    },
    reducers: {
        fetchCurrenciesSuccess: (state, action) => {
            state.currencies = action.payload;
            state.loading = false;
        },
        fetchCurrenciesBegin: (state) => {
            state.loading = true;
        },
        fetchCurrenciesFailure: (state, action) => {
            state.errors.push(action.payload);
            state.loading = false;
        },
        fetchCurrenciesRatesSuccess: (state, action) => {
            state.currenciesRates = action.payload;
            state.loadingCurrenciesRates = false;
        },
        fetchCurrenciesRatesBegin: (state) => {
            state.loadingCurrenciesRates = true;
        },
        fetchCurrenciesRatesFailure: (state, action) => {
            state.errors.push(action.payload);
            state.loadingCurrenciesRates = false;
        },
        historyOperationFailure: (state, action) => {
            // when AsyncStorage fails with an error
            state.errors.push(action.payload);
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const {
    fetchCurrenciesSuccess,
    fetchCurrenciesBegin,
    fetchCurrenciesFailure,
    fetchCurrenciesRatesSuccess,
    fetchCurrenciesRatesBegin,
    fetchCurrenciesRatesFailure,
    setHistory,
    historyOperationFailure,
} = appSlice.actions;

export const initHistory = async(dispatch, getState) => {
    let history = null;
    try {
        history = await AsyncStorage.getItem('history');
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
        return;
    }

    if (history !== null) {
        dispatch(setHistory(JSON.parse(history)));
    }
}

export const updateHistory = data => async(dispatch) => {
    // check if history exists
    // if not, then create new
    // else update old history
    let history = null;
    try {
        history = await AsyncStorage.getItem('history');
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
    }

    const now = new Date();
    const newKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    // add new data
    const newHistory = JSON.parse(history) || {};
    newHistory[newKey] = data;

    // delete old history
    const keys = Object.keys(newHistory);
    for (const key of keys) {
        const date = Date.parse(key);
        if (date < now - 604800000) {
            delete newHistory[key];
        }
    }

    try {
        await AsyncStorage.setItem('history', JSON.parse(newHistory));
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
        return;
    }

    setHistory(newHistory);
}

// Fetch currencies rates
export const fetchCurrenciesRates = (currencies) => async(dispatch) => {
        dispatch(fetchCurrenciesRatesBegin());

        let data = null;

        try {
            data = await getCurrenciesRates(currencies);
        } catch (error) {
            const name = error.name;
            const message = error.message;
            dispatch(fetchCurrenciesRatesFailure({ name, message }));
            return;
        }

        if (data !== null) {
            dispatch(fetchCurrenciesRatesSuccess(data));
            dispatch(updateHistory(data));
        }
    }
    // Fetch currencies
export const fetchCurrencies = async(dispatch) => {
    dispatch(fetchCurrenciesBegin());
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`;

    let currencies = null;
    try {
        const response = await axios.get(url);
        currencies = response.data.supported_codes;
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(fetchCurrenciesFailure({ name, message }));
        return;
    }

    if (currencies !== null) {
        dispatch(fetchCurrenciesSuccess(currencies));
        dispatch(fetchCurrenciesRates(currencies));
    }
}

export default appSlice.reducer;