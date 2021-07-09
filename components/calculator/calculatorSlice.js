import { createSlice } from "@reduxjs/toolkit";

export const calculatorSlice = createSlice({
    name: 'calculator',
    initialState: {
        currencies: [],
        currenciesByCode: {},
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
            const data = action.payload.data;
            state.currenciesByCode[code] = data;
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
            state.amount = amount.payload;
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
    dispatch(fetchCodesBegin)
    const url = `${baseUrl}/${currencyCode}`;
    axios.get(url).then(response => {
        currencies = response.data.supported_codes;
        dispatch(fetchCurrencySuccess(currencies));
    }).catch(error => {
        dispatch(fetchCurrencyFailure(error))
    })
}

export default calculatorSlice.reducer;