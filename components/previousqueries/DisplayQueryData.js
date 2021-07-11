import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { DataTable } from "react-native-paper";

export default function DisplayQueryData(props) {
    const selectedQuery = useSelector((state) => state.calculator.selectedQuery);

    const tableRows = selectedQuery.conversion_rates.map(entry => {
        const amount = entry.amount.toFixed(4);
        return (
            <DataTable.Row key={entry.code}>
                <DataTable.Cell>{`${entry.name} (${entry.code})`} </DataTable.Cell>
                <DataTable.Cell numeric>{amount}</DataTable.Cell>
            </DataTable.Row>
        )
    });

    return (
        <ScrollView style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title numeric></DataTable.Title>
                    <DataTable.Title numeric>
                        {selectedQuery.amount} {selectedQuery.code}
                    </DataTable.Title>
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