import React from "react";
import {useSelector} from "react-redux";
import {ScrollView, StyleSheet} from "react-native";
import {Paragraph} from "react-native-paper";

// Component
export default function Logging(props) {
    const errors = useSelector((state) => state.app.errors);
    const errorItems = errors.map( (error, index) => (
        <Paragraph style={styles.para} key={index}>
            {error.message}: {error.detail}
        </Paragraph>
    ))
    return (<ScrollView>
        {errorItems}
    </ScrollView>)
}

// Styles
const styles = StyleSheet.create({
    para: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})