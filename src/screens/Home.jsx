import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  useTheme,
  Text,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IP } from '../Components/IP.jsx';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const cargarUsuario = async () => {
        try {
          const datos = await AsyncStorage.getItem('usuario');
          const parsed = JSON.parse(datos);
          if (isActive) setUser(parsed);
        } catch (error) {
          console.error('Error al cargar usuario:', error);
        }
      };

      cargarUsuario();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Image
            size={80}
            source={
              user.profile_picture_name
                ? { uri: `${IP}/uploads/${user.profile_picture_name}?t=${Date.now()}` } // evitar caché
                : require('../assets/default-profile.png')
            }
          />
          <View style={styles.textContainer}>
            <Title>{user.name}</Title>
            <Paragraph style={styles.bio}>
              {user.bio || 'Desarrollador & QA'}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.subtitle}>📊 Tus estadísticas</Text>
        <View style={styles.statsContainer}>
          <Stat label="Proyectos" value="12" />
          <Stat label="Experiencia" value="2 años" />
          <Stat label="Educación" value="2 títulos" />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.subtitle}>🧭 Navegación</Text>

        <Button
          icon={() => <Icon name="briefcase" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('Experiencia')}
          style={styles.button}
        >
          Ver Experiencia
        </Button>

        <Button
          icon={() => <Icon name="code-tags" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('proyectos')}
          style={styles.button}
        >
          Ver Proyectos
        </Button>

        <Button
          icon={() => <Icon name="school" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('Educacion')}
          style={styles.button}
        >
          Ver Educación
        </Button>

        <Button
          icon={() => <Icon name="file-download" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('CVPDF')}
          style={styles.button}
        >
          Descargar CV
        </Button>
      </View>
    </ScrollView>
  );
};

const Stat = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statText}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  bio: {
    flexShrink: 1,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  subtitle: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#777',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    marginVertical: 5,
  },
});

export default Home;
