import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { TextInput, Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import {removeCurrency, setMainCurrency, setAmount, fetchCurrency} from "./calculatorSlice";


export default function CurrencyWidget({code, name }) {
    const [value, setValue] = useState("0");
    const [error, setError] = useState("");
    const currency = useSelector((state) => state.calculator.currenciesByCode[code]);
    const dispatch = useDispatch();

    useEffect(() => {
        if(currency === undefined){
            dispatch(fetchCurrency(url, code))
        }
    }, [null])

    // Display an error if a user types an invalid number
    const errorText = Boolean(error) ? <Text>{error}</Text> : null;

    function onChangeHandler(txt) {
        setValue(txt);
        let amount = parseFloat(txt);
        if (!isNaN(amount))
            dispatch(setAmount(amount)),
            dispatch(setMainCurrency(code))
        else
            setError("Enter a valid number");
    }

    function removeThisCurrency(){
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