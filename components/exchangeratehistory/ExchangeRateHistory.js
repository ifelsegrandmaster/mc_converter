import React from "react";
import { useSelector } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";
import { List, Text } from "react-native-paper";

// Component
export default function ExchangeRateHistory(props) {
    const history = useSelector((state) => state.app.history);
    // Get the keys for all entries in history
    const historyKeys = Object.keys(history);
    // History is added in ascending order
    // with the most recent at the bottom. It has to be reversed
    historyKeys.reverse();
    const content = (historyKeys.length > 0) ? historyKeys.map(entry => {
        const date = new Date(entry);
        const title = date.toDateString();

        return (<List.Item
            key={entry}
            title={title}
            style={styles.listItem}
        />);
    }) : <Text style={styles.textCenter}>No history yet</Text>;

    return (
        <ScrollView>
            {content}
        </ScrollView>
    )
}

// Styles
const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    },
    textCenter: {
        textAlign: 'center',
        width: '100%'
    }
})