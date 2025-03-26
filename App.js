import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import Contexts
import ThemeProvider  from './context/ThemeContext';
import LocationProvider from './context/LocationContext';
import SettingsProvider from './context/SettingsContext';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import LocationScreen from './screens/LocationScreen';
import SettingsScreen from './screens/SettingsScreen';
import AlertScreen from './screens/AlertScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocationProvider>
          <SettingsProvider>
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                      case 'Home':
                        iconName = focused ? 'home' : 'home-outline';
                        break;
                      case 'Locations':
                        iconName = focused ? 'location' : 'location-outline';
                        break;
                      case 'Alerts':
                        iconName = focused ? 'alert-circle' : 'alert-circle-outline';
                        break;
                      case 'Settings':
                        iconName = focused ? 'settings' : 'settings-outline';
                        break;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'gray',
                })}
              >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Locations" component={LocationScreen} />
                <Tab.Screen name="Alerts" component={AlertScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </SettingsProvider>
        </LocationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}