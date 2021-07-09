import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, SnackBar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { addCurrency } from "./calculatorSlice";

export default function CurrencyListItem({ code, name }) {
    const selectedCurrencies = useSelector((state) => state.calculator.currencies);
    const selectedCurrenciesCodes = selectedCurrencies.map(currency => currency[0]);
    const dispatch = useDispatch();

    function addThisCurrency() {
        // check if currency already been added
        if (!selectedCurrenciesCodes.includes(code)) {
            dispatch(addCurrency([code, name]));
        }
    }
    return (< List.Item style={styles.listItem}
        title={code}
        description={name}
        onPress={addThisCurrency}
    />)
}


const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})