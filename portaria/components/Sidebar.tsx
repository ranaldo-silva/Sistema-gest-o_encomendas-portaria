import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

export default function Sidebar() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [aberta, setAberta] = useState(false);

  const isMobile = width < 768; // 👈 Se for celular ou tablet pequeno

  const navegar = (rota: string) => {
    setAberta(false);
    router.push(rota);
  };

  if (isMobile) {
    return (
      <>
        <TouchableOpacity style={styles.hamburguer} onPress={() => setAberta(!aberta)}>
          <Text style={styles.hamburguerTexto}>☰</Text>
        </TouchableOpacity>

        {aberta && (
          <View style={styles.sidebarMobile}>
            <Text style={styles.logo}>Portaria Light</Text>

            <TouchableOpacity style={styles.menuButton} onPress={() => navegar("/")}>
              <Text style={styles.menuText}>🏠 Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => navegar("/moradores/cadastrar")}>
              <Text style={styles.menuText}>👤 Moradores</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => navegar("/encomendas/registrar")}>
              <Text style={styles.menuText}>📦 Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => navegar("/validar-encomenda")}>
              <Text style={styles.menuText}>✅ Validar</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }

  // 💻 Layout Desktop
  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Portaria Light</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/")}>
        <Text style={styles.menuText}>🏠 Início</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/moradores/cadastrar")}>
        <Text style={styles.menuText}>👤 Cadastrar Morador</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/encomendas/registrar")}>
        <Text style={styles.menuText}>📦 Registrar Encomenda</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/validar-encomenda")}>
        <Text style={styles.menuText}>✅ Validar Retirada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: "#0d47a1",
    paddingTop: 60,
    paddingHorizontal: 15,
    height: "100%",
  },
  sidebarMobile: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 220,
    height: "100%",
    backgroundColor: "#0d47a1",
    paddingTop: 60,
    paddingHorizontal: 15,
    zIndex: 10,
  },
  logo: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  menuButton: {
    backgroundColor: "#1565c0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
  },
  hamburguer: {
    padding: 12,
    backgroundColor: "#0d47a1",
  },
  hamburguerTexto: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
