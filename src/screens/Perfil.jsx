import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Image, TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { IP } from '../Components/IP';
import {
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  Avatar,
  useTheme,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const safeArray = (value) => {
  try {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return JSON.parse(value);
  } catch (_) {
    return [];
  }
  return [];
};

const Perfil = () => {
  const { colors } = useTheme();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await AsyncStorage.getItem('usuario');
        const parsed = JSON.parse(datos);
        setPerfil(parsed);
        if (parsed.profile_picture_name) {
          setProfileImageUri(`${IP}/uploads/${parsed.profile_picture_name}`);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, []);

  const handleChange = (field, value) => {
    setPerfil({ ...perfil, [field]: value });
  };

  const handleActualizar = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', perfil.name || '');
      formData.append('email', perfil.email || '');
      formData.append('phone', perfil.phone || '');
      formData.append('bio', perfil.bio || '');
      formData.append('linkedin', perfil.linkedin || '');
      formData.append('github', perfil.github || '');
      formData.append('skills', JSON.stringify(safeArray(perfil.skills)));
      formData.append('languages', JSON.stringify(safeArray(perfil.languages)));

      if (profileImageUri && !profileImageUri.startsWith('http')) {
        const fileName = profileImageUri.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('image', {
          uri: profileImageUri,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      const response = await axios.put(`${IP}/api/users/${perfil.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = response.data.usuario || perfil;
      await AsyncStorage.setItem('usuario', JSON.stringify(updatedUser));
      alert('Perfil actualizado correctamente.');
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el perfil.');
    }
    setUpdating(false);
  };

  const seleccionarImagen = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setProfileImageUri(selectedImage.uri);
    }
  };

  if (loading || !perfil) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={seleccionarImagen} style={styles.imageContainer}>
        <Avatar.Image
          size={120}
          source={
            profileImageUri
              ? { uri: profileImageUri }
              : require('../assets/default-profile.png')
          }
        />
        <Text variant="labelSmall" style={styles.cambiarFoto}>Toca para cambiar foto</Text>
      </TouchableOpacity>

      <Divider style={{ marginVertical: 10 }} />

      <TextInput label="Nombre" value={perfil.name || ''} onChangeText={(text) => handleChange('name', text)} style={styles.input} />
      <TextInput label="Correo electrónico" keyboardType="email-address" value={perfil.email || ''} onChangeText={(text) => handleChange('email', text)} style={styles.input} />
      <TextInput label="Teléfono" keyboardType="phone-pad" value={perfil.phone || ''} onChangeText={(text) => handleChange('phone', text)} style={styles.input} />
      <TextInput label="Bio" multiline numberOfLines={3} value={perfil.bio || ''} onChangeText={(text) => handleChange('bio', text)} style={styles.input} />
      <TextInput label="LinkedIn" value={perfil.linkedin || ''} onChangeText={(text) => handleChange('linkedin', text)} style={styles.input} />
      <TextInput label="GitHub" value={perfil.github || ''} onChangeText={(text) => handleChange('github', text)} style={styles.input} />

      <Button mode="contained" loading={updating} onPress={handleActualizar} style={{ marginTop: 20 }}>
        {updating ? 'Actualizando...' : 'Actualizar'}
      </Button>
      <Button mode="contained" loading={updating} onPress={()=>navigation.navigate('login')} style={{ marginTop: 20 }}>
          Cerrar sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginVertical: 6 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  cambiarFoto: { marginTop: 6, color: '#888' },
});

export default Perfil;
