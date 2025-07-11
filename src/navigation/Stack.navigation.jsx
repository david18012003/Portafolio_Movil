import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login.jsx';
import TabsNavigation from './Tabs.navigation.jsx';
import RegistroUser from '../screens/registro_user.jsx';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="login" 
        component={Login} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="home" 
        component={TabsNavigation} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="registro"
        component={RegistroUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Experiencia" 
        component={require('../screens/Experiencia.jsx').default} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="CVPDF" 
        component={require('../screens/CVPDF.jsx').default} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Educacion" 
        component={require('../screens/Educacion.jsx').default} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
      name='proyectos'
      component={require('../screens/Proyectos.jsx').default}
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
