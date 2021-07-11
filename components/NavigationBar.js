import { Appbar, Menu } from "react-native-paper";
import React, {useState} from "react";

function NavigationBar({ navigation, previous, scene }) {
    const title = scene.descriptor.options.title;
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
        <Appbar.Header>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu} />
                }
            >
                <Menu.Item
                    onPress={() => {
                        navigation.navigate("Calculator");
                        closeMenu();
                    }}
                    title="Convert" />
                <Menu.Item
                    onPress={() => {
                        navigation.navigate("PreviousQueries");
                        closeMenu();
                    }
                    }
                    title="Previous Queries" />
                <Menu.Item
                    onPress={() => {
                        navigation.navigate("ExchangeRateHistory")
                        closeMenu();
                }}
                    title="Exchange Rate History" />
            </Menu>
        </Appbar.Header>
    )
}

export default NavigationBar;