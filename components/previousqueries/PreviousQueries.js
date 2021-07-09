import React,{Component} from "react";
import {StyleSheet,View} from "react-native";
import {List} from "react-native-paper";



class PreviousQueries extends Component {
    render(){
        return (
            <View>
                <List.Item
                 style={styles.listItem}
                 title="Today @ 12:23"
                 description="USD, Rand, Kwacha"
                />
                <List.Item
                 title="Today @ 07:23"
                 style={styles.listItem}
                 description="USD, Pound, INR"
                />
                <List.Item
                 title="Yesterday @ 14:45"
                 description="Yen, Pound, INR"
                 style={styles.listItem}
                />
                <List.Item
                 title="06/07/2021 @ 23:12"
                 description="USD, ZWL, Kwacha"
                 style={styles.listItem}
                />
            </View>
        )
    }
}

export default PreviousQueries;

const styles = StyleSheet.create({
    listItem:{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})