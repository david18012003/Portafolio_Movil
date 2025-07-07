import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { IP } from '../Components/IP'; // Asegúrate que esta exporta correctamente la IP

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  const validar = async () => {
    if (user.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post(`${IP}/api/users/login`, {
        correo: user,
        password: password
      });

      setUserData(response.data.usuario); // Ajusta según la estructura del backend
      Alert.alert('Éxito', 'Usuario autenticado correctamente');
      console.log('Datos del usuario:', response.data);

      // Opcional: navega a otra pantalla si es exitoso
      // navigation.navigate('Home');

    } catch (error) {
      if (error.response) {
    // El servidor respondió con un código de error (4xx o 5xx)
    console.log('🔴 Error de respuesta del servidor:', error.response.data);
    console.log('📄 Status:', error.response.status);
    Alert.alert('Error del servidor', `Código: ${error.response.status}`);
  } else if (error.request) {
    // La solicitud fue hecha pero no hubo respuesta (servidor no responde)
    console.log('🟡 El servidor no respondió. Request:', error.request);
    Alert.alert('Error de red', 'El servidor no responde');
  } else {
    // Error desconocido (por ejemplo configuración)
    console.log('⚠️ Error desconocido:', error.message);
    Alert.alert('Error desconocido', error.message);
  }

  // Imprimir todo el error por si acaso
  console.error('Detalle completo del error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Input
        label="Correo electrónico"
        placeholder="Ingrese su correo"
        value={user}
        onChangeText={setUser}
        errorMessage={user.trim() === '' ? 'El campo es obligatorio' : ''}
      />

      <Input
        label="Contraseña"
        placeholder="Ingrese su contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        errorMessage={password.trim() === '' ? 'El campo es obligatorio' : ''}
      />

      <Button title="Ingresar" onPress={validar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
  },
});

export default Login;
