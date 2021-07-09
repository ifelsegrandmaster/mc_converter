import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { removeCurrency, setMainCurrency, setAmount, fetchCurrency } from "./calculatorSlice";



export default function CurrencyWidget({ code, name, amount }) {
    console.log("Individual currency widget:",amount.toString());
    const [value, setValue] = useState("");
    console.log("Individual currency widget value:",value);
    const [error, setError] = useState("");
    const conversionRates = useSelector((state) => state.calculator.conversionRatesByCode[code]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (conversionRates === undefined) {
            const baseUrl = `https://v6.exchangerate-api.com/v6/e1784ad33c5214a00ee9e85c/latest`;
            console.log("Now fetching currency data");
            console.log(code);
            dispatch(fetchCurrency(baseUrl, code))
        }
        setValue(amount.toString());
    }, [amount])

    // Display an error if a user types an invalid number
    const errorText = Boolean(error) ? <Text>{error}</Text> : null;

    function onChangeHandler(txt) {
        setValue(txt);
        let amount = parseFloat(txt);
        if (!isNaN(amount)) {
            dispatch(setAmount(amount)),
            console.log(code)
            dispatch(setMainCurrency(code))
        }
        else {
            setError("Enter a valid number");
        }
    }

    function removeThisCurrency() {
        dispatch(removeCurrency(code));
        console.log("I was called");
    }
    return (
        <View>
            <View style={styles.currency}>
                <View style={styles.textInputContainer}>
                    <TextInput
                        label={name}
                        mode="outlined"
                        value={value}
                        onChangeText={txt => onChangeHandler(txt)}
                        style={styles.textInput}
                    />
                </View>
                <View>
                    <Button
                        style={styles.removeCurrencyButton}
                        title="Add currency"
                        mode="contained"
                        onPress={() => { removeThisCurrency() }}>
                        Remove
             </Button>
                </View>
            </View>
            {errorText}
        </View>
    )
}

const styles = StyleSheet.create(
    {
        currency: {
            marginTop: 5,
            marginBottom: 5,
            flex: 1,
            flexDirection: "row",
            width: "100%",
        },
        currencyItemsContainer: {
            height: 300,
        },
        removeCurrencyButton: {
            padding: 10,
            marginBottom: 5,
            marginTop: 5
        },
        textInputContainer: {
            flex: 3,
            marginRight: 5,
        }
    }
)