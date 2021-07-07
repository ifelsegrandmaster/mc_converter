import React from 'react';
import {StyleSheet} from 'react-native';
import "react-native-gesture-handler";
import { Provider as PaperProvider } from 'react-native-paper';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ExchangeRateHistory from "./components/exchangeratehistory/ExchangeRateHistory";
import Calculator from "./components/calculator/Calculator";
import PreviousQueries from "./components/previousqueries/PreviousQueries";
import NavigationBar from "./components/NavigationBar";
const Stack  = createStackNavigator();


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Calculator"
          screenOptions={{
            header: (props) => <NavigationBar {...props} />
          }}
        >
          <Stack.Screen name="Calculator" component={Calculator} />
          <Stack.Screen name="ExchangeRateHistory" component={ExchangeRateHistory} />
          <Stack.Screen name="PreviousQueries" component={PreviousQueries} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});