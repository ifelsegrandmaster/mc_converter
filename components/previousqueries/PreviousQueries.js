import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {setQueryToDisplay} from "../calculator/calculatorSlice";

import { StyleSheet, ScrollView } from "react-native";
import { List, Portal, Dialog, DataTable, Button, Paragraph } from "react-native-paper";



// Component
export default function PreviousQueries({navigation}) {

    const queries = useSelector((state) => state.calculator.queries);
    const dispatch = useDispatch();
    const displayQuery = (query) => {
        dispatch(setQueryToDisplay(query));
        navigation.navigate("DisplayQueryData");
    }

    // the queries are added in ascending order
    // with the most recent at the bottom
    // so they have to be reversed
    for(const q of queries){
        console.log(q);
    }
    const queryListItems = queries.slice(0).reverse().map((query, index) =>
    (
        <List.Item
            key={index}
            title={`${query.amount} ${query.name} (${query.code})`}
            onPress={() => displayQuery(query)}
            description={query.timestamp}
            style={styles.listItem}
        />)
    )
    return (
        <ScrollView>
            {queryListItems}
        </ScrollView>
    )
}

// Styles
const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})