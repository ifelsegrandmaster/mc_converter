import React from "react";
import { useSelector } from "react-redux";

import { StyleSheet, ScrollView } from "react-native";
import { List } from "react-native-paper";

// Component
export default function PreviousQueries(props) {
    const queries = useSelector((state) => state.calculator.queries);
    // the queries are added in ascending order
    // with the most recent at the bottom
    // so they have to be reversed
    const items = queries.slice(0).reverse().map((query, index) =>
    (<List.Item
        key={index}
        title={query.code}
        description={query.timestamp}
        style={styles.listItem}
    />)
    )
    return (
        <ScrollView>
            {items}
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