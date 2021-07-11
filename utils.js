import axios from "axios";
import { API_KEY } from "@env";
console.log(API_KEY, "in why does this always happen");

// fetch currency data
export async function fetchCurrencyData(code) {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${code}`;
    // make a request
    const response = await axios(url);
    const data = response.data;
    return data;
}
// fetch invdividual currency history data

// Get currencies data first
export default async function getCurrenciesRates(currencies) {

    const result = await Promise.all(currencies.map(currency =>
        fetchCurrencyData(currency[0])));
    const rates = {}
    result.map(currency => {
        rates[currency.base_code] = currency.conversion_rates;
    })
    return rates;
}