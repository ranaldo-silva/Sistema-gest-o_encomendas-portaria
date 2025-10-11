// app/validar-encomenda.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Sidebar from "../components/Sidebar";
import { getEncomendas, saveEncomendas } from "../lib/storage";

export default function ValidarEncomenda() {
  const [token, setToken] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function validarToken() {
    try {
      if (!token.trim()) {
        Alert.alert("Atenção", "Insira o token da encomenda.");
        return;
      }

      setCarregando(true);
      const lista = await getEncomendas();
      const idx = lista.findIndex((e) => e.token === token.trim());
      if (idx === -1) {
        Alert.alert("Token inválido", "Nenhuma encomenda encontrada com esse token.");
        setCarregando(false);
        return;
      }

      const encomenda = lista[idx];
      if (encomenda.retirada) {
        Alert.alert("Aviso", `Encomenda já retirada em ${encomenda.retiradaEm}.`);
        setCarregando(false);
        return;
      }

      encomenda.retirada = true;
      encomenda.retiradaEm = new Date().toLocaleString();

      lista[idx] = encomenda;
      await saveEncomendas(lista);

      Alert.alert("Confirmado", `Encomenda token ${token} marcada como retirada.`);
      setToken("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao validar token.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.areaConteudo}>
        <Text style={styles.titulo}>Validar Retirada</Text>
        <TextInput
          style={styles.input}
          placeholder="Código da Encomenda"
          value={token}
          onChangeText={setToken}
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={[styles.botao, carregando && { opacity: 0.6 }]} onPress={validarToken} disabled={carregando}>
          <Text style={styles.botaoText}>{carregando ? "Validando..." : "Confirmar Retirada"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f8fafc" },
  areaConteudo: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#0d47a1", marginBottom: 10 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#cbd5e1", marginBottom: 12 },
  botao: { backgroundColor: "#8e24aa", padding: 14, borderRadius: 8, alignItems: "center" },
  botaoText: { color: "#fff", fontWeight: "700" },
});
