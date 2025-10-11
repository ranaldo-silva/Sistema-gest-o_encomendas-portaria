// components/Sidebar.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Sidebar() {
  const router = useRouter();

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Portaria Light</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/")}>
        <Text style={styles.menuText}>🏠 Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/moradores/cadastrar")}
      >
        <Text style={styles.menuText}>👤 Cadastrar Morador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/encomendas/registrar")}
      >
        <Text style={styles.menuText}>📦 Registrar Encomenda</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push("/validar-encomenda")}
      >
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
});
