import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {DataTable, Headline} from "react-native-paper";

export default function DisplayQueryData(props) {
    const selectedQuery = useSelector((state) => state.calculator.selectedQuery);

    const tableRows = selectedQuery.conversion_rates.map(entry => {
        console.log(entry);
        return (
            <DataTable.Row key={entry.code}>
                <DataTable.Cell>{`${entry.name} (${entry.code})`} </DataTable.Cell>
                <DataTable.Cell numeric>{entry.amount}</DataTable.Cell>
            </DataTable.Row>
        )
    });

    return (
        <ScrollView style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title numeric></DataTable.Title>
                    <DataTable.Title numeric>{selectedQuery.amount} {selectedQuery.code}</DataTable.Title>
                </DataTable.Header>
                {tableRows}
            </DataTable>
        </ScrollView>
    )
}

// Styles

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    }
})