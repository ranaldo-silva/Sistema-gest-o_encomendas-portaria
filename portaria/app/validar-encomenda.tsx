import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Sidebar from "../components/Sidebar";
import { confirmarRetirada } from "../lib/storage";
import { notify } from "../utils/notify";

// ✅ Formata a hora local para o fuso horário de São Paulo (GMT-3)
function formatarHoraLocal() {
  const agora = new Date();
  const opcoes: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("pt-BR", opcoes).format(agora);
}

export default function ValidarEncomenda() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function validar() {
    if (!token.trim()) return notify("Atenção", "Digite o token da encomenda!");

    try {
      setLoading(true);

      await confirmarRetirada(token.trim());

      // ✅ Mostra a hora exata de validação no fuso de Brasília
      const hora = formatarHoraLocal();
      notify("✅ Sucesso", `Retirada confirmada com sucesso às ${hora}.`);

      setToken("");
    } catch (err: any) {
      console.error(err);
      notify("Erro", err.message || "Token inválido ou encomenda não encontrada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Validar Retirada</Text>

        <TextInput
          style={styles.input}
          placeholder="Token (somente números)"
          value={token}
          onChangeText={setToken}
          keyboardType="numeric"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.botao, loading && { opacity: 0.6 }]}
          onPress={validar}
          disabled={loading}
        >
          <Text style={styles.textoBotao}>
            {loading ? "Validando..." : "Confirmar Retirada"}
          </Text>
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
    backgroundColor: "#8e24aa",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
