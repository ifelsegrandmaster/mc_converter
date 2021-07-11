import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencies, initHistory } from "../../appSlice";
import { saveQuery, initQueries } from "./calculatorSlice";
import { API_KEY } from "@env";

import { StyleSheet, ScrollView, View} from "react-native";
import { Button, Portal, Dialog, Snackbar } from "react-native-paper";
import CurrenciesList from "./CurrenciesList";
import CurrencyWidget from "./CurrencyWidget";


// Component
export default function Calculator() {
    const dispatch = useDispatch();

    const currencies = useSelector((state) => state.app.currencies);
    const currenciesRates = useSelector((state) => state.app.currenciesRates);

    const currenciesToBeConverted = useSelector((state) => state.calculator.currenciesToBeConverted);
    const mainCurrency = useSelector((state) => state.calculator.mainCurrency);
    const amount = useSelector((state) => state.calculator.amount);
    const currentRate = currenciesRates[mainCurrency];

    // Show and hide dialog
    const [dialogIsVisible, setDialogIsVisible] = useState(false);
    const showDialog = () => setDialogIsVisible(true);
    const hideDialog = () => setDialogIsVisible(false);

    // show and hid Snackbar
    const [snackBarIsVisible, setSnackBarVisible] = useState(false);
    const onToggleSnackBar = () => setSnackBarVisible(!snackBarIsVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    // store the currency code, converted amount and the code
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
        code: Boolean(mainCurrency) ? mainCurrency : null,
        conversion_rates: [],
    }

    const currencyWidgets = currenciesToBeConverted.map(currency => {
        // get the conversion rate
        const code = currency[0];
        const conversionRate = (currentRate !== undefined) ? currentRate[code] : 0;
        const convertedAmount = amount * conversionRate;

        // only update if mainCurrency and currentRate are valid
        if (Boolean(mainCurrency) && currentRate !== undefined) {
            query.conversion_rates.push({ code, amount })
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
            <Button
                style={styles.addCurrencyButton}
                icon="plus"
                title="Add currency"
                mode="contained"
                onPress={showDialog}>
                Add currency
            </Button>
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
        marginTop: 5
    },
    saveQueryButton: {
        padding: 10,
        marginBottom: 5,
        marginTop: 5
    }
});