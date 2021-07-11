import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencies, initHistory, setCurrenciesRates } from "../../appSlice";
import { saveQuery, initQueries } from "./calculatorSlice";

import { StyleSheet, ScrollView, View } from "react-native";
import { Button, Portal, Dialog, Snackbar, TextInput, Paragraph } from "react-native-paper";
import CurrenciesList from "./CurrenciesList";
import CurrencyWidget from "./CurrencyWidget";
import DropDown from 'react-native-paper-dropdown';

// Component
export default function Calculator() {
    const dispatch = useDispatch();

    const currencies = useSelector((state) => state.app.currencies);
    const currenciesRates = useSelector((state) => state.app.currenciesRates);
    // To be used to display text if currencies data
    // is not loaded. A network, authentication or authorization error
    // might occur and data will not be available.

    const currenciesReady = useSelector((state) => state.app.currenciesReady);
    const loadingCurrencies = useSelector((state) => state.app.loadingCurrencies);

    let currenciesStatus = "";
    if (!loadingCurrencies && !currenciesReady) {
        currenciesStatus = "Could not retrieve currencies";
    }

    const currenciesRatesReady = useSelector((state) => state.app.currenciesRatesReady);
    const loadingCurrenciesRates = useSelector((state) => state.app.loadingCurrenciesRates);

    let currenciesRatesStatus = "";
    if (!loadingCurrenciesRates && !currenciesRatesReady) {
        currenciesRatesStatus = "Could not retrieve currencies rates";
    }

    const currenciesToBeConverted = useSelector((state) => state.calculator.currenciesToBeConverted);
    const mainCurrency = useSelector((state) => state.calculator.mainCurrency);
    const amount = useSelector((state) => state.calculator.amount);

    const currentRate = (mainCurrency && currenciesRates) ? currenciesRates[mainCurrency.code] : null;

    // Populate the dropdown with keys from history, which are date strings.
    const history = useSelector((state) => state.app.history);
    const historyList = Object.keys(history).map(entry => {
        const d = new Date(entry);
        let label = d.toDateString();
        const now = new Date();
        if (d.getDate() === now.getDate()) {
            label = "Today";
        }
        return { value: entry, label: label };
    });
    // Set dropdown state
    const [showDropDown, setShowDropDown] = useState(false);
    const [date, setDate] = useState();
    // On change handler
    const setNewDateValue = (value) => {
        setDate(value);
        // Set currencies rates using history
        const rates = history[value];
        dispatch(setCurrenciesRates(rates));
    }

    // Show and hide dialog
    const [dialogIsVisible, setDialogIsVisible] = useState(false);
    const showDialog = () => setDialogIsVisible(true);
    const hideDialog = () => setDialogIsVisible(false);

    // show and hide Snackbar
    const [snackBarIsVisible, setSnackBarVisible] = useState(false);
    const onToggleSnackBar = () => setSnackBarVisible(!snackBarIsVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    // store the currency code, currecy name, converted amount and the code
    /**
     * {
     *   code: 'USD'
     *   timestamp: Date()
     *   conversion_rates: [
     *       {
     *           code: 'AUD',
     *           amount: 1234
     *       },
     *       {
     *           code: 'CAD',
     *           amount: 2345
     *       }
     *   ]
     * }
     */
    const timestamp = new Date();
    let saveQueryButtonEnabled = false;
    const query = {
        timestamp: timestamp.toLocaleString(),
        amount: amount,
        code: mainCurrency ? mainCurrency.code : null,
        name: mainCurrency ? mainCurrency.name : null,
        conversion_rates: [],
    }
    // Create a list of currency widgets which is a text input and
    // a button. The button is for remove the widget if it's no longer needed
    const currencyWidgets = currenciesToBeConverted.map(currency => {
        // get the conversion rate
        const code = currency[0];
        const name = currency[1];
        const conversionRate = (currentRate !== null) ? currentRate[code] : 0;
        const convertedAmount = amount * conversionRate;

        // only update if mainCurrency and currentRate are valid
        if (mainCurrency && currentRate !== null) {
            query.conversion_rates.push({ name, code, amount: convertedAmount })
        }

        return (
            <CurrencyWidget
                key={currency[0]}
                code={currency[0]}
                amount={convertedAmount}
                name={currency[1]} />
        )
    }
    )
    // Allow user to save data
    if (query.code !== null && query.conversion_rates.length > 0) {
        saveQueryButtonEnabled = true;
    }
    // save query
    function saveQueryHandler(query) {
        // save this query to storage if it is a valid query
        dispatch(saveQuery(query));
        setSnackBarVisible(true);
    }


    useEffect(() => {
        // initialize currencies history
        dispatch(initHistory);
        // initialize queries history
        dispatch(initQueries);
        // Fetch data from exchange rate api
        dispatch(fetchCurrencies);
    }, [null])

    return (
        <View style={styles.container}>
            <View style={styles.scrollView}>
                <ScrollView>
                    <View>
                        <Button
                            style={styles.addCurrencyButton}
                            icon="plus"
                            title="Add currency"
                            mode="contained"
                            onPress={showDialog}
                        >
                            Add currency
                </Button>
                        <DropDown
                            label={"Select day"}
                            mode={'outlined'}
                            value={date}
                            setValue={setNewDateValue}
                            list={historyList}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            inputProps={{
                                right: <TextInput.Icon name={'menu-down'} />,
                            }}
                        />

                    </View>
                    <Portal>
                        <Dialog visible={dialogIsVisible} onDismiss={hideDialog}>
                            <Dialog.Title>Add currency</Dialog.Title>
                            <Dialog.Content>
                                <CurrenciesList closeDialog={hideDialog} currencies={currencies} />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button title="Close" onPress={hideDialog}>Close</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    {currencyWidgets}
                    <Button
                        style={styles.saveQueryButton}
                        disabled={!saveQueryButtonEnabled}
                        title="Add currency"
                        mode="contained"
                        onPress={() => saveQueryHandler(query)}>
                        Save query
            </Button>
                </ScrollView>
            </View>
            <View style={styles.bottomBar}>
                <Paragraph>{currenciesStatus}</Paragraph>
                <Paragraph>{currenciesRatesStatus}</Paragraph>
                <Snackbar
                    visible={snackBarIsVisible}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            // Do something
                            setSnackBarVisible(false);
                        },
                    }}>
                    Saving query
            </Snackbar>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        flexDirection: "column"
    },
    scrollView: {
        flex: 6,
    },
    bottomBar: {
        flex: 1,
    },
    addCurrencyButton: {
        padding: 10,
        marginBottom: 5,
        marginTop: 5,
        flex: 1,
    },
    saveQueryButton: {
        padding: 10,
        marginBottom: 5,
        marginTop: 5
    }
});