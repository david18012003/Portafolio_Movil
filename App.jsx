import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import StackNavigator from './src/navigation/Stack.navigation.jsx';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createNativeStackNavigator()

const App = () => {
 

  return (
    <PaperProvider
    settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
      >
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer> 
    </PaperProvider>
    
  );
}


export default App