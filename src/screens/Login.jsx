import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Title,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { IP } from '../Components/IP';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [user, setUser] = useState('cesar.carrillo1@email.com');
  const [password, setPassword] = useState('12345678');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const validar = async () => {
    setSubmitted(true);

    if (user.trim() === '' || password.trim() === '') {
      Alert.alert('❌ Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${IP}/api/users/login`, {
        correo: user,
        password,
      });

      const usuario = response.data.usuario[0];
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

      Alert.alert('✅ Éxito', 'Usuario autenticado correctamente');
      navigation.navigate('home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('❌ Error', 'Credenciales incorrectas o error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Iniciar sesión</Title>

        <TextInput
          label="Correo electrónico"
          value={user}
          onChangeText={(text) => {
            setUser(text);
            if (submitted) setSubmitted(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={submitted && user.trim() === ''}
          style={styles.input}
        />
        {submitted && user.trim() === '' && (
          <Text style={styles.error}>El correo es obligatorio</Text>
        )}

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (submitted) setSubmitted(false);
          }}
          secureTextEntry
          error={submitted && password.trim() === ''}
          style={styles.input}
        />
        {submitted && password.trim() === '' && (
          <Text style={styles.error}>La contraseña es obligatoria</Text>
        )}

        <Button
          mode="contained"
          onPress={validar}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Ingresar
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('registro')}
          style={{ marginTop: 16 }}
        >
          ¿No tienes cuenta? Crear una
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
});

export default Login;
