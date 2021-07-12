import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getCurrenciesRates from "./utils";
import { AsyncStorage } from "react-native";
import { API_KEY } from "@env";
import { Platform } from "react-native";


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        currencies: [],
        currenciesReady: false,
        loadingCurrencies: false,
        currenciesRates: null,
        currenciesRatesReady: false,
        loadingCurrenciesRates: false,
        history: {},
        errors: []
    },
    reducers: {
        fetchCurrenciesSuccess: (state, action) => {
            state.currencies = action.payload;
            state.loadingCurrencies = false;
            state.currenciesReady = true;
        },
        fetchCurrenciesBegin: (state) => {
            state.loadingCurrencies = true;
        },
        fetchCurrenciesFailure: (state, action) => {
            state.errors.push(action.payload);
            state.loadingCurrencies = false;
        },
        setCurrenciesRates: (state, action) => {
            state.currenciesRates = action.payload;
            state.currenciesRatesReady = true;
        },
        fetchCurrenciesRatesSuccess: (state, action) => {
            state.currenciesRates = action.payload;
            state.currenciesRatesReady = true;
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
    setCurrenciesRates,
} = appSlice.actions;

export const initHistory = async(dispatch) => {
    let history = null;
    if (Platform.OS === 'android') {
        try {
            history = await AsyncStorage.getItem('history');
        } catch (error) {
            const detail = "Could not get history from local storage";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
            return;
        }
    }

    if (Platform.OS === 'web') {
        history = localStorage.getItem('history');
    }

    if (history !== null) {
        dispatch(setHistory(JSON.parse(history)));
    }
}



export const updateHistory = data => async(dispatch) => {
    let history = null;
    // Android
    if (Platform.OS === 'android') {
        try {
            history = await AsyncStorage.getItem('history');
        } catch (error) {
            const detail = "Could not get history from local storage";
            const message = error.message;
            console.log(message);
            dispatch(historyOperationFailure({ detail, message }));
            return;
        }
    }

    // Web
    if (Platform.OS === 'web') {
        history = localStorage.getItem('history');
    }


    const now = new Date();
    const newKey = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    // use old history if not null else create new history
    const newHistory = JSON.parse(history) || {};
    // add new data
    newHistory[newKey] = data;


    // delete old history
    const keys = Object.keys(newHistory);
    for (const key of keys) {
        const date = Date.parse(key);
        if (date < now - 604800000) {
            delete newHistory[key];
        }
    }

    // save the history
    if (Platform.OS === 'android') {
        try {
            await AsyncStorage.setItem('history', JSON.stringify(newHistory));
        } catch (error) {
            const detail = "Could not save history to local storage.";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
            return;
        }
    }

    if (Platform.OS === 'web') {
        localStorage.setItem('history', JSON.stringify(newHistory));
    }
    dispatch(setHistory(newHistory));
}

// Fetch currencies rates
export const fetchCurrenciesRates = (currencies) => async(dispatch) => {
    dispatch(fetchCurrenciesRatesBegin());

    let data = null;

    try {
        data = await getCurrenciesRates(currencies);
    } catch (error) {
        const detail = "Could not fetch currencies rates.";
        const message = error.message;
        dispatch(fetchCurrenciesRatesFailure({ detail, message }));
        return;
    }

    if (data !== null) {
        dispatch(fetchCurrenciesRatesSuccess(data));
        // save to history
        dispatch(updateHistory(data));
    }
};

export const saveCurrencies = (currencies) => async(dispatch) => {
    if (Platform.OS === 'android') {
        try {
            await AsyncStorage.setItem('currencies', JSON.stringify(currencies));
        } catch (error) {
            const detail = "Could not save currencies to local storage.";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
        }
    }

    if (Platform.OS === 'web') {
        localStorage.setItem('currencies', JSON.stringify(currencies));
    }
}

// Load currencies from cache, for example if network error occurs
export const loadCurrenciesFromCache = async(dispatch) => {
        let currencies = null;
        if (Platform.OS === 'android') {
            try {
                currencies = await AsyncStorage.getItem('currencies');
            } catch (error) {
                const detail = "Could not load currencies from storage.";
                const message = error.message;
                dispatch(historyOperationFailure({ detail, message }));
                return;
            }
        }

        if (Platform.OS === 'web') {
            currencies = localStorage.getItem('currencies');
        }

        if (currencies !== null) {
            dispatch(fetchCurrenciesSuccess(JSON.parse(currencies)));
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
        const detail = "Could not load currencies from remote server." +
            " Aborting fetch currencies rates.";
        const message = error.message;
        dispatch(fetchCurrenciesFailure({ detail, message }));
        dispatch(loadCurrenciesFromCache);
        return;
    }

    if (currencies !== null) {
        dispatch(fetchCurrenciesSuccess(currencies));
        // cache this data
        dispatch(saveCurrencies(currencies))
            // fetch currencies rates
        dispatch(fetchCurrenciesRates(currencies));
    }

}

export default appSlice.reducer;