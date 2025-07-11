import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';
import { IP } from '../Components/IP';
import { useNavigation } from '@react-navigation/native';

const CVPDF = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarUrlCV = async () => {
      try {
        const datos = await AsyncStorage.getItem('usuario');
        const user = JSON.parse(datos);
        const url = `${IP}/api/pdf/${user.id}`; // asegúrate de que sea HTTPS
        setPdfUrl(url);
        console.log('Cargando PDF desde:', url);
      } catch (error) {
        console.error('Error cargando el CV:', error);
        Alert.alert('Error', 'No se pudo cargar el CV');
        navigation.goBack();
      }
    };

    cargarUrlCV();
  }, []);

  if (!pdfUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando CV...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: pdfUrl }}
        onLoadComplete={(numberOfPages) => {
          console.log(`PDF cargado con ${numberOfPages} páginas`);
        }}
        onError={(error) => {
          console.log('Error al mostrar PDF:', error);
          Alert.alert('Error', 'No se pudo mostrar el PDF');
        }}
        style={styles.pdf}
        trustAllCerts={true} // si estás haciendo pruebas locales
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pdf: { flex: 1, width: '100%', height: '100%' },
});

export default CVPDF;
