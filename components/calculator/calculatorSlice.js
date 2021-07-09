import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState: {
        currencies: [],
        conversionRatesByCode: {},
        mainCurrency: null,
        loading: false,
        amount: 0,
        error: null,
    },
    reducers: {
        addCurrency: (state, action) => {
            // Check if the currency has already been added
            state.currencies.push(action.payload);
        },
        fetchCurrencySuccess: (state, action) => {
            const code = action.payload.code;
            const conversionRates = action.payload.conversionRates;
            state.conversionRatesByCode[code] = conversionRates;
            state.loading = false
        },
        fetchCurrencyBegin: (state) => {
            state.loading = true;
        },
        fetchCurrencyFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        removeCurrency: (state, action) => {
            const currencies = state.currencies;
            const newCurrencies = currencies.filter(currency => currency[0] !== action.payload);
            state.currencies = newCurrencies;
        },
        setMainCurrency: (state, action) => {
            state.mainCurrency = action.payload;
        },
        setAmount: (state, action) => {
            state.amount = action.payload;
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
} = calculatorSlice.actions;


export const fetchCurrency = (baseUrl, currencyCode) => dispatch => {
    dispatch(fetchCurrencyBegin())
    axios.get(`${baseUrl}/${currencyCode}`).then(response => {
        const code = response.data.base_code;
        const conversionRates = response.data.conversion_rates;
        dispatch(fetchCurrencySuccess({ code, conversionRates }));
    }).catch(error => {
        const data = error.response.data;
        const status = error.response.status;
        dispatch(fetchCurrencyFailure({ status, data }))
    })
}

export default calculatorSlice.reducer;