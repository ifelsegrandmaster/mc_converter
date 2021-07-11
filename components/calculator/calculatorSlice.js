import { createSlice } from "@reduxjs/toolkit";
import { AsyncStorage } from "react-native";
import { historyOperationFailure } from "../../appSlice";

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState: {
        currenciesToBeConverted: [],
        mainCurrency: null,
        loading: false,
        amount: 0,
        queries: [],
        error: null,
    },
    reducers: {
        addCurrency: (state, action) => {
            // Check if the currency has already been added
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
        }
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
} = calculatorSlice.actions;

// Initialize queries
export const initQueries = async(dispatch, getState) => {
    let queries = null;
    try {
        queries = await AsyncStorage.getItem('queries');
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
        return;
    }

    if (queries !== null) {
        dispatch(setQueries(JSON.parse(queries)));
    }
}

export const saveQuery = query => async(dispatch) => {
    // get the previous queries
    let queries = null;
    try {
        queries = await AsyncStorage.getItem('queries');
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
        return;
    }

    const newQueries = JSON.parse(queries) || [];
    newQueries.push(query);

    // save to storage
    try {
        await AsyncStorage.setItem('queries', JSON.stringify(newQueries));
    } catch (error) {
        const name = error.name;
        const message = error.message;
        dispatch(historyOperationFailure({ name, message }));
    }

    // update state
    dispatch(setQueries(newQueries));
}
export default calculatorSlice.reducer;