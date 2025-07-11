import React, { useState } from "react";
import {
  Dialog,
  Portal,
  TextInput,
  Button,
  Menu,
  Avatar,
} from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { IP } from "../Components/IP";

const estadosDisponibles = ["En progreso", "En actualización", "Completado"];

const ModalProjects = ({
  visible,
  onDismiss,
  proyecto,
  setProyecto,
  onGuardar,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  if (!proyecto) return null;

  const abrirMenu = () => setMenuVisible(true);
  const cerrarMenu = () => setMenuVisible(false);

  const seleccionarEstado = (estado) => {
    setProyecto({ ...proyecto, Status: estado });
    cerrarMenu();
  };

  const seleccionarImagen = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setProyecto({ ...proyecto, image: selectedImage.uri });
    }
  };

  const handleTecnologiasChange = (text) => {
    const array = text.split(",").map((tech) => tech.trim());
    setProyecto({ ...proyecto, technologies: array });
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ marginHorizontal: 10, maxHeight: 750 }}
      >
        <Dialog.Title>Editar Proyecto</Dialog.Title>
        <Dialog.Content>
          {/* Imagen */}
          <TouchableOpacity
            onPress={seleccionarImagen}
            style={styles.imagePicker}
          >
            {proyecto.image ? (
              <Image
                source={{
                  uri:
                    proyecto.image.startsWith("http") ||
                    proyecto.image.startsWith("file://")
                      ? proyecto.image
                      : `${IP}/uploads/${proyecto.image}`,
                }}
                style={styles.image}
              />
            ) : (
              <Avatar.Icon size={80} icon="image" />
            )}
          </TouchableOpacity>

          <TextInput
            label="Título"
            value={proyecto.title}
            onChangeText={(text) => setProyecto({ ...proyecto, title: text })}
            style={styles.input}
          />

          <TextInput
            label="Descripción"
            multiline
            value={proyecto.description}
            onChangeText={(text) =>
              setProyecto({ ...proyecto, description: text })
            }
            style={styles.input}
          />

          <TextInput
            label="Link del proyecto"
            value={proyecto.link}
            onChangeText={(text) => setProyecto({ ...proyecto, link: text })}
            style={styles.input}
          />

          <TextInput
            label="Tecnologías (separadas por coma)"
            value={
              Array.isArray(proyecto.technologies)
                ? proyecto.technologies.join(", ")
                : ""
            }
            onChangeText={handleTecnologiasChange}
            style={styles.input}
          />

          <Menu
            visible={menuVisible}
            onDismiss={cerrarMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={abrirMenu}
                style={{ marginTop: 10 }}
              >
                {proyecto.Status || "Seleccionar estado"}
              </Button>
            }
          >
            {estadosDisponibles.map((estado, index) => (
              <Menu.Item
                key={index}
                onPress={() => seleccionarEstado(estado)}
                title={estado}
              />
            ))}
          </Menu>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={onGuardar}>Guardar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default ModalProjects;
