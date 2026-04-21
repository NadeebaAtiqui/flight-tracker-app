import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenTest from './app/screens/HomeScreenTest';

import HomeScreen from './app/screens/HomeScreen';
import FlightStatusScreen from './app/screens/FlightStatusScreen';
import SavedTripsScreen from './app/screens/SavedTripsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreenTest} />
        <Stack.Screen name="FlightStatus" component={FlightStatusScreen} />
        <Stack.Screen name="SavedTrips" component={SavedTripsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}