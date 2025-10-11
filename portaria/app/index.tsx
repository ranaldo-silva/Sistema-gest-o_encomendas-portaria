// app/index.tsx
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Sidebar from "../components/Sidebar";
import { getMoradores, getEncomendas, Encomenda } from "../lib/storage";

export default function Home() {
  const [moradoresCount, setMoradoresCount] = useState(0);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const router = useRouter();

  async function carregar() {
    const ms = await getMoradores();
    const es = await getEncomendas();
    setMoradoresCount(ms.length);
    setEncomendas(es);
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  const totalRetiradas = encomendas.filter((e) => e.retirada).length;

  const recentes = [...encomendas]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.areaConteudo}>
        <Text style={styles.titulo}>Painel da Portaria</Text>
        <Text style={styles.subtitulo}>Bem-vindo! Veja abaixo o resumo do sistema.</Text>

        <View style={styles.cardsContainer}>
          <View style={[styles.card, { backgroundColor: "#1976d2" }]}>
            <Text style={styles.cardTitulo}>Moradores</Text>
            <Text style={styles.cardValor}>{moradoresCount}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: "#2e7d32" }]}>
            <Text style={styles.cardTitulo}>Encomendas</Text>
            <Text style={styles.cardValor}>{encomendas.length}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: "#8e24aa" }]}>
            <Text style={styles.cardTitulo}>Retiradas</Text>
            <Text style={styles.cardValor}>{totalRetiradas}</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>📦 Encomendas Recentes</Text>

        {recentes.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma encomenda registrada ainda.</Text>
        ) : (
          <FlatList
            data={recentes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.itemTexto}>
                    <Text style={styles.bold}>Token:</Text> {item.token}{" "}
                    <Text style={styles.bold}>| Origem:</Text> {item.origem}
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => router.push(`/encomendas/registrar?editId=${item.id}`)}
                    >
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { marginLeft: 8 }]}
                      onPress={() => router.push(`/encomendas/registrar?deleteId=${item.id}`)}
                    >
                      <Text style={styles.actionText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.itemData}>
                  {item.retirada ? `✅ Retirada em ${item.retiradaEm}` : `⏳ Recebida em ${item.data}`}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f8fafc" },
  areaConteudo: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#0d47a1" },
  subtitulo: { color: "#475569", marginBottom: 20 },
  cardsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { flex: 1, marginRight: 10, padding: 20, borderRadius: 12, alignItems: "center" },
  cardTitulo: { color: "#fff", fontSize: 16 },
  cardValor: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  secaoTitulo: { fontSize: 18, fontWeight: "bold", color: "#0d47a1", marginBottom: 10 },
  vazio: { color: "#475569" },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  itemTexto: { fontSize: 15, color: "#1e293b" },
  bold: { fontWeight: "bold" },
  itemData: { color: "#475569", marginTop: 8, fontSize: 13 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#e6eef8", borderRadius: 6 },
  actionText: { color: "#0d47a1", fontWeight: "600", fontSize: 13 },
});
