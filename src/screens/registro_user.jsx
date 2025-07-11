import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Alert, ActivityIndicator
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import axios from 'axios';
import { IP } from '../Components/IP'; // Asegúrate que tengas este archivo configurado

const RegistroUser = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validarCampos = () => {
    return (
      form.name.trim() !== '' &&
      form.email.trim() !== '' &&
      form.phone.trim() !== '' &&
      form.password.trim() !== ''
    );
  };

  const registrarUsuario = async () => {
    setSubmitted(true);
    if (!validarCampos()) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${IP}/api/users/registrar`, form);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada con éxito.');
      navigation.navigate('login');
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <Input
        label="Nombre completo"
        placeholder="Ej. Juan Pérez"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        errorMessage={submitted && form.name.trim() === '' ? 'Campo obligatorio' : ''}
      />

      <Input
        label="Correo electrónico"
        placeholder="ejemplo@correo.com"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        errorMessage={submitted && form.email.trim() === '' ? 'Campo obligatorio' : ''}
      />

      <Input
        label="Teléfono"
        placeholder="Ej. 3001234567"
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
        errorMessage={submitted && form.phone.trim() === '' ? 'Campo obligatorio' : ''}
      />

      <Input
        label="Contraseña"
        placeholder="Mínimo 6 caracteres"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        errorMessage={submitted && form.password.trim() === '' ? 'Campo obligatorio' : ''}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Registrarse" onPress={registrarUsuario} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  }
});

export default RegistroUser;
