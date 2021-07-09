import React,{Component} from "react";
import {StyleSheet, Text, View, AppRegistry} from "react-native";
import {List} from "react-native-paper";

class ExchangeRateHistory extends Component {
    render(){
        return (
            <View>
                <List.Item
                 style={styles.listItem}
                 title="Monday"
                />
                <List.Item
                 title="Tuesday"
                 style={styles.listItem}
                />
                <List.Item
                 title="Wednesday"
                 style={styles.listItem}
                />
                <List.Item
                 title="Thursday"
                 style={styles.listItem}
                />
                <List.Item
                 title="Friday"
                 style={styles.listItem}
                />
                <List.Item
                 title="Saturday"
                 style={styles.listItem}
                />
                <List.Item
                 title="Sunday"
                 style={styles.listItem}
                />
            </View>
        )
    }
}

export default ExchangeRateHistory;

const styles = StyleSheet.create({
    listItem:{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})