import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, ScrollView, View } from "react-native";
import { Button, Portal, Dialog } from "react-native-paper";
import { fetchCodes } from "../../appSlice";
import CurrenciesList from "./CurrenciesList";
import CurrencyWidget from "./CurrencyWidget";
export default function Calculator() {
    const dispatch = useDispatch();
    const currencies = useSelector((state) => state.app.currencies);
    const selectedCurrencies = useSelector((state) => state.calculator.currencies);
    function calculate(code, amount) {
    }
    const currenciesWidgets = selectedCurrencies.map(currency =>
    (
        <CurrencyWidget key={currency[0]} code={currency[0]} name={currency[1]} />
    )
    )
    const [dialogIsVisible, setDialogIsVisible] = useState(false);
    useEffect(() => {
        // Fetch data from exchange rate api
        const url = `https://v6.exchangerate-api.com/v6/e1784ad33c5214a00ee9e85c/codes`;
        dispatch(fetchCodes(url));
        console.log("Calling this function to fetch currencies");
    }, [null])
    const showDialog = () => setDialogIsVisible(true);
    const hideDialog = () => setDialogIsVisible(false);
    return (
            <ScrollView style={styles.container}>
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
                            <CurrenciesList currencies={currencies} />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button title="Close" onPress={hideDialog}>Close</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                {currenciesWidgets}
            </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
    },
    addCurrencyButton: {
        padding: 10,
        marginBottom: 5,
        marginTop: 5
    },
    textInputContainer: {
        flex: 3,
        marginRight: 5,
    }
});