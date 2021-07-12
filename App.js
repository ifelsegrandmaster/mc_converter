import React from "react";

import { Provider as StoreProvider } from "react-redux";
import store from "./store";

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Provider as PaperProvider } from "react-native-paper";
import ExchangeRateHistory from "./components/exchangeratehistory/ExchangeRateHistory";
import Calculator from "./components/calculator/Calculator";
import PreviousQueries from "./components/previousqueries/PreviousQueries";
import DisplayQueryData from "./components/previousqueries/DisplayQueryData";
import NavigationBar from "./components/NavigationBar";
import Logging from "./components/logging/Logging";


const Stack = createStackNavigator();
// Component
export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Calculator"
            screenOptions={{
              header: (props) => <NavigationBar {...props} />
            }}
          >
            <Stack.Screen
              options={{ title: "Multi-currency converter" }}
              name="Calculator"
              component={Calculator}
            />
            <Stack.Screen
              name="ExchangeRateHistory"
              component={ExchangeRateHistory}
              options={{ title: "Exchange rate history" }}
            />
            <Stack.Screen
              name="PreviousQueries"
              component={PreviousQueries}
              options={{ title: "Previous Queries" }}
            />
            <Stack.Screen
              name="DisplayQueryData"
              component={DisplayQueryData}
              options={{ title: "Display Query Data" }}
            />
            <Stack.Screen
              name="Logging"
              component={Logging}
              options={{ title: "Error logs" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
}

