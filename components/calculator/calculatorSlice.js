import { createSlice } from "@reduxjs/toolkit";
import { AsyncStorage } from "react-native";
import { Platform } from "react-native";
import { historyOperationFailure } from "../../appSlice";


export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState: {
        currenciesToBeConverted: [],
        mainCurrency: null,
        amount: 0,
        queries: [],
        selectedQuery: null,
    },
    reducers: {
        addCurrency: (state, action) => {
            state.currenciesToBeConverted.push(action.payload);
        },
        removeCurrency: (state, action) => {
            const currenciesToBeConverted = state.currenciesToBeConverted;
            const newCurrencies = currenciesToBeConverted.filter(currency => currency[0] !== action.payload);
            state.currenciesToBeConverted = newCurrencies;
        },
        setMainCurrency: (state, action) => {
            state.mainCurrency = action.payload;
        },
        setAmount: (state, action) => {
            state.amount = action.payload;
        },
        setQueries: (state, action) => {
            state.queries = action.payload;
        },
        setQueryToDisplay: (state, action) => {
            state.selectedQuery = action.payload;
        },
    }
});

export const {
    addCurrency,
    removeCurrency,
    fetchCurrencyBegin,
    fetchCurrencySuccess,
    fetchCurrencyFailure,
    setMainCurrency,
    setAmount,
    setQueries,
    setQueryToDisplay,
} = calculatorSlice.actions;

// Initialize queries
export const initQueries = async(dispatch) => {
    let queries = null;
    if (Platform.OS === 'android') {
        try {
            queries = await AsyncStorage.getItem('queries');
        } catch (error) {
            const detail = "Could not load queries from local storage";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
            return;
        }
    }

    if (Platform.OS === 'web') {
        queries = localStorage.getItem('queries');
    }

    if (queries !== null) {
        dispatch(setQueries(JSON.parse(queries)));
    }
}

export const saveQuery = query => async(dispatch) => {
    // get the previous queries
    let queries = null;
    if (Platform.OS === 'android') {
        try {
            queries = await AsyncStorage.getItem('queries');
        } catch (error) {
            const detail = "Could not get queries from local storage.";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
            return;
        }
    }

    if (Platform.OS === 'web') {
        queries = localStorage.getItem('queries');
    }

    const newQueries = JSON.parse(queries) || [];
    newQueries.push(query);

    // save to storage
    if (Platform.OS === 'android') {
        try {
            await AsyncStorage.setItem('queries', JSON.stringify(newQueries));
        } catch (error) {
            const detail = "Could not save query to local storage.";
            const message = error.message;
            dispatch(historyOperationFailure({ detail, message }));
        }
    }

    if (Platform.OS === 'web') {
        localStorage.setItem('queries', JSON.stringify(newQueries));
    }

    // update state
    dispatch(setQueries(newQueries));
}
export default calculatorSlice.reducer;