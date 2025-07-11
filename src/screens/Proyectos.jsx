import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Linking,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Card,
  Text,
  ActivityIndicator,
  FAB,
  Chip,
  Button,
} from "react-native-paper";
import axios from "axios";
import { IP } from "../Components/IP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ModalProjects from "../Modales/Modal.Projects";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const navigation = useNavigation();

  const cargarProyectos = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("usuario"));
      const res = await axios.get(`${IP}/api/projects/listar/${user.id}`);
      setProyectos(res.data);
    } catch (e) {
      console.error("Error cargando proyectos", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const abrirModal = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setModalVisible(true);
  };

  const guardarCambios = async () => {
    try {
      const formData = new FormData();
      formData.append("title", proyectoSeleccionado.title);
      formData.append("description", proyectoSeleccionado.description);
      formData.append("status", proyectoSeleccionado.Status);
      formData.append("link", proyectoSeleccionado.link);
      formData.append("technologies", proyectoSeleccionado.technologies);

      if (
        proyectoSeleccionado.image &&
        proyectoSeleccionado.image.startsWith("file://")
      ) {
        const fileName = proyectoSeleccionado.image.split("/").pop();
        const fileType = fileName.split(".").pop();
        formData.append("image", {
          uri: proyectoSeleccionado.image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      await axios.put(
        `${IP}/api/projects/actualizar/${proyectoSeleccionado.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setModalVisible(false);
      await cargarProyectos();
      Alert.alert("✅ Proyecto actualizado");
    } catch (e) {
      console.error("Error al actualizar proyecto:", e);
      Alert.alert(
        "❌ Error",
        e?.response?.data?.error || "No se pudo actualizar el proyecto"
      );
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {proyectos.map((proj, idx) => {
          let tecnologias = [];

          try {
            tecnologias = Array.isArray(proj.technologies)
              ? proj.technologies
              : JSON.parse(proj.technologies || "[]");
          } catch (err) {
            console.error("Error parsing technologies:", err);
          }

          return (
            <Card key={idx} style={styles.card} mode="elevated">
              {proj.image && (
                <TouchableOpacity onPress={() => setImagenAmpliada(proj.image)}>
                  <Card.Cover
                    source={{ uri: `${IP}/uploads/${proj.image}` }}
                    style={styles.cover}
                  />
                </TouchableOpacity>
              )}

              <Card.Title title={proj.title} subtitle={`📌 ${proj.Status}`} />

              <Card.Content>
                <Text style={styles.description}>{proj.description}</Text>
                <View style={styles.techContainer}>
                  {tecnologias.map((tech, i) => (
                    <Chip key={i} style={styles.chip}>
                      {tech}
                    </Chip>
                  ))}
                </View>
              </Card.Content>

              <Card.Actions>
                {proj.link && (
                  <Button icon="github" onPress={() => Linking.openURL(proj.link)}>
                    Ver Proyecto
                  </Button>
                )}
                <Button icon="pencil" onPress={() => abrirModal(proj)}>
                  Editar
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </ScrollView>

      {/* Modal de imagen ampliada con fondo difuso */}
      {imagenAmpliada && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setImagenAmpliada(null)}>
          <View style={styles.overlay}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.overlayTouchable}
              onPress={() => setImagenAmpliada(null)}
            >
              <Image
                source={{ uri: `${IP}/uploads/${imagenAmpliada}` }}
                style={styles.fullImage}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <FAB
        icon="home"
        style={styles.fab}
        onPress={() => navigation.navigate("home")}
        label="Inicio"
      />

      <ModalProjects
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        proyecto={proyectoSeleccionado}
        setProyecto={setProyectoSeleccionado}
        onGuardar={guardarCambios}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  cover: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
  techContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "50%",
    resizeMode: "contain",
    borderRadius: 12,
  },
});

export default Proyectos;
