import { Appbar, Menu } from "react-native-paper";
import React from "react";

function NavigationBar({ navigation, previous }) {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
        <Appbar.Header>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title="Multi-currency converter" />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu} />
                }
            >
                <Menu.Item
                    onPress={() => navigation.navigate("Calculator")}
                    title="Calculate" />
                <Menu.Item
                    onPress={() => navigation.navigate("PreviousQueries")}
                    title="Previous Queries" />
                <Menu.Item
                    onPress={() => navigation.navigate("ExchangeRateHistory")}
                    title="Exchange Rate History" />
            </Menu>
        </Appbar.Header>
    )
}

export default NavigationBar;