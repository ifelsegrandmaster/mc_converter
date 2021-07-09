import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { StyleSheet, View} from "react-native";
import {MMKV} from "react-native-mmkv";
import { List } from "react-native-paper";

export default function (props) {
    const dispatch = useDispatch();
    const history = useSelector((state) => state.exchangeratehistory.history);
    useEffect(() => {
        // fetch history but first check if history already exists in the
        // AsyncStorage

    }, [null])
    return (
        <View>
            <List.Item
                style={styles.listItem}
                title="Monday"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
    }
})