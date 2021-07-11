import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { List } from "react-native-paper";
import { StyleSheet } from "react-native";
import { addCurrency } from "./calculatorSlice";

// Component
export default function CurrencyListItem({ code, name, closeDialog }) {
    const currenciesToBeConverted = useSelector((state) => state.calculator.currenciesToBeConverted);
    const currenciesToBeConvertedCodes = currenciesToBeConverted.map(currency => currency[0]);
    const dispatch = useDispatch();

    function addThisCurrency() {
        // check if currency already been added
        if (!currenciesToBeConvertedCodes.includes(code)) {
            dispatch(addCurrency([code, name]));
        }
        closeDialog();
    }
    return (<List.Item style={styles.listItem}
        title={code}
        description={name}
        onPress={addThisCurrency}
    />)
}

// Styles
const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})