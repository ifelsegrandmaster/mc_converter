import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Currency from "./Currency";

export default function CurrenciesList() {
    const currencies = useSelector((state) => state.app.currencies);
    const [text, setText] = useState("");
    const [filteredCurrencies, setFilterCurrencies] = useState([]);
    function onChangeText(txt) {
        setText(txt);
        // filter items based on the value entered by the user
        let fitleredList = currencies.filter(currency =>
            (currency[0].includes(txt)))
        setFilterCurrencies(fitleredList);
    }

    const currencyItems = filteredCurrencies.map(currency =>
        (<Currency key={currency[0]} code={currency[0]} name={currency[1]} />))

    return (
        <ScrollView style={styles.currencyItemsContainer}>
            <TextInput
                onChangeText={text => onChangeText(text)}
                value={text}
                mode="outlined"
                label="Search for currency"
                placeholder="Start typing..." />
            {currencyItems}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    currencyItemsContainer: {
        height: 200,
    }
})