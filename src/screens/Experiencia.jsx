import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Experiencia = () => {
  const [experiencia, setExperiencia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const user = await AsyncStorage.getItem('usuario');
      const parsed = JSON.parse(user);
      const data = parsed.experience ? JSON.parse(parsed.experience) : [];
      setExperiencia(data);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {experiencia.map((exp, idx) => (
        <Card key={idx} style={styles.card}>
          <Card.Title title={exp.title} subtitle={exp.company} />
          <Card.Content>
            <Text variant="bodyMedium">{exp.description}</Text>
            <Text variant="labelSmall" style={{ marginTop: 5 }}>
              {exp.start_date} a {exp.end_date || 'Actualidad'}
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

export default Experiencia;
