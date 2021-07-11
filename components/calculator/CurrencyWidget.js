import React, { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import { TextInput, Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { removeCurrency, setMainCurrency, setAmount } from "./calculatorSlice";


export default function CurrencyWidget({ code, name, amount }) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        setValue(amount.toString());
    }, [amount])

    // Display an error if a user types an invalid number
    const errorText = Boolean(error) ? <Text>{error}</Text> : null;

    function onChangeHandler(txt) {
        setValue(txt);
        let amount = parseFloat(txt);
        if (!isNaN(amount)) {
            dispatch(setAmount(amount));
            dispatch(setMainCurrency({name, code}));
            setError("");
        }
        else {
            setError("Enter a valid number");
            dispatch(setMainCurrency(null));
        }
    }

    function removeThisCurrency() {
        dispatch(removeCurrency(code));
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
                <View styl={styles.removeCurrencyButtonContainer}>
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
        removeCurrencyButtonContainer: {
            flex: 2
        },
        textInputContainer: {
            flex: 3,
            marginRight: 5,
        }
    }
)