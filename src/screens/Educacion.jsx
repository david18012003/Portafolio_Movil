import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Educacion = () => {
  const [educacion, setEducacion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const user = await AsyncStorage.getItem('usuario');
      const parsed = JSON.parse(user);
      const data = parsed.education ? JSON.parse(parsed.education) : [];
      setEducacion(data);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {educacion.map((edu, idx) => (
        <Card key={idx} style={styles.card}>
          <Card.Title title={edu.degree} subtitle={edu.institution} />
          <Card.Content>
            <Text variant="bodyMedium">{edu.level} - {edu.status}</Text>
            <Text variant="labelSmall" style={{ marginTop: 5 }}>
              {edu.start_date} a {edu.end_date || 'Actualidad'}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  card: { marginBottom: 15 },
});

export default Educacion;
