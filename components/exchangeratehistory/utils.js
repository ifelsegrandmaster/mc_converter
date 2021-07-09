import axios from "axios";
// Day in milliseconds
const DAY = 86400000;
// fetch currency data
export async function fetchCurrencyData(url) {
    // make a request
    const response = await axios(url);
    return response;
}
// fetch invdividual currency history data
export async function fetchCurrencyHistory(currency) {
    const code = currency[0];
    const today = new Date();
    // we want to loop through to the last seventh day
    // from yesterday
    // create an array of urls
    const urls = [];
    for (let i = 1; i <= 6; i++) {
        const date = new Date(today - DAY * i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        // Remove the the key from here
        const url = `https://v6.exchangerate-api.com/v6/e1784ad33c5214a00ee9e85c/history/${code}/${year}/${month}/${day}`;
        urls.push(url);
    }

    console.log(urls);

    const data = await Promise.all(urls.map(url => fetchCurrencyData(url)))
    return {
        code,
        data
    };
}

// Get currencies data first
export default async function getCurrenciesHistoricalData(currencies) {
    const data = await Promise.all(currencies.map(currency =>
        fetchCurrencyHistory(currency)))
    return data;
}