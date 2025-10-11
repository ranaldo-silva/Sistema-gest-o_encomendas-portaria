import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Sidebar from "../../components/Sidebar";



export default function ValidarRetirada() {
  const [codigo, setCodigo] = useState("");

  const validar = () => {
    if (!codigo) return Alert.alert("Atenção", "Digite o código da encomenda.");
    Alert.alert("✅ Retirada validada", `Código ${codigo} confirmado com sucesso.`);
    setCodigo("");
  };

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Validar Retirada</Text>

        <TextInput
          style={styles.input}
          placeholder="Código da Encomenda"
          value={codigo}
          onChangeText={setCodigo}
        />

        <TouchableOpacity style={styles.botao} onPress={validar}>
          <Text style={styles.textoBotao}>Confirmar Retirada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flex: 1, backgroundColor: "#f8f9fb" },
  conteudo: { flex: 1, padding: 30 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#0d47a1", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  botao: {
    backgroundColor: "#9C27B0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
