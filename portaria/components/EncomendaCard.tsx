import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function EncomendaCard({ item, onEdit, onDelete }) {
  function formatarData(dataString?: string) {
    if (!dataString) return "—";
    try {
      const d = new Date(dataString);
      return d.toLocaleString("pt-BR");
    } catch {
      return "—";
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        <Text style={styles.bold}>Token:</Text> {item.token || "—"}{" "}
        | <Text style={styles.bold}>Origem:</Text> {item.origem || "—"}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Morador:</Text>{" "}
        {item.morador?.nome || "—"}
      </Text>
      <Text style={styles.text}>
        🕒 Recebida em: {formatarData(item.dataRecebimento)}
      </Text>
      {item.retiradaEm && (
        <Text style={styles.text}>
          ✅ Retirada em: {formatarData(item.retiradaEm)}
        </Text>
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item)}>
          <Text style={styles.delete}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  text: { color: "#334155", marginVertical: 2 },
  bold: { fontWeight: "bold" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
    gap: 10,
  },
  edit: { color: "#1d4ed8", fontWeight: "600" },
  delete: { color: "#b91c1c", fontWeight: "600" },
});
