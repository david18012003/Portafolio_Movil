import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Perfil from '../screens/Perfil';

// Importa tus pantallas aquí

const Tab = createBottomTabNavigator();

export default function TabsNavigation() {
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Home" component={Home} options={{ headerShown: false }}/>
                <Tab.Screen name="Profile" component={Perfil} options={{ headerShown: false }}/>
            </Tab.Navigator>
    );
}