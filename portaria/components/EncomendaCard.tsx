import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  nome: string;
  data: string;
  status: string;
}

export default function EncomendaCard({ nome, data, status }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.data}>{data}</Text>
      </View>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nome: { fontWeight: "bold", fontSize: 15 },
  data: { fontSize: 13, color: "#777" },
  status: { backgroundColor: "#C8E6C9", padding: 5, borderRadius: 5, color: "#2E7D32" },
});
