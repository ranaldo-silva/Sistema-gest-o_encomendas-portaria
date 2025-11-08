// app/index.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Sidebar from "../components/Sidebar";
import {
  getMoradores,
  getEncomendas,
  Encomenda,
  deleteEncomenda,
} from "../lib/storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import { notify } from "../utils/notify";
import { abrirWhatsApp } from "../lib/whatsapp"; 

// Mostra data/hora no fuso de São Paulo (GMT-3)
function formatarData(iso?: string) {
  if (!iso) return "—";
  try {
    const data = new Date(iso);
    const opcoes: Intl.DateTimeFormatOptions = {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("pt-BR", opcoes).format(data);
  } catch {
    return "—";
  }
}

export default function Home() {
  const [moradoresCount, setMoradoresCount] = useState(0);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  async function carregar() {
    try {
      const moradores = await getMoradores();
      const encomendas = await getEncomendas();
      setMoradoresCount(moradores.length);
      setEncomendas(encomendas);
    } catch (err) {
      notify("Erro", "Falha ao carregar dados da API.");
      console.error("Erro ao carregar:", err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  const totalRetiradas = encomendas.filter((e) => e.retirada).length;
  const recentes = [...encomendas]
    .sort((a, b) => {
      const ta = new Date(a.dataRegistro ?? a.dataRecebimento ?? 0).getTime();
      const tb = new Date(b.dataRegistro ?? b.dataRecebimento ?? 0).getTime();
      return tb - ta;
    })
    .slice(0, 5);

  async function confirmarExcluirEncomenda(id: string | number) {
    const ok =
      Platform.OS === "web"
        ? window.confirm("Deseja excluir essa encomenda?")
        : true;

    if (!ok) return;

    try {
      await deleteEncomenda(id);
      notify("Sucesso", "Encomenda excluída.");
      carregar();
    } catch (err) {
      console.error(err);
      notify("Erro", "Falha ao excluir encomenda.");
    }
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View
        style={[
          styles.areaConteudo,
          { paddingTop: Platform.OS === "android" ? 60 : 80 },
        ]}
      >
        <Text style={styles.titulo}>Painel da Portaria</Text>
        <Text style={styles.subtitulo}>
          Bem-vindo! Veja abaixo o resumo do sistema.
        </Text>

        {/* 📊 Cards do topo */}
        <View
          style={[
            styles.cardsContainer,
            isMobile && { flexDirection: "column" },
          ]}
        >
          {[
            { titulo: "Moradores", valor: moradoresCount, cor: "#1976d2" },
            { titulo: "Encomendas", valor: encomendas.length, cor: "#2e7d32" },
            { titulo: "Retiradas", valor: totalRetiradas, cor: "#8e24aa" },
          ].map((c, i) => (
            <Animated.View
              key={c.titulo}
              entering={FadeInDown.delay(i * 150).duration(600).springify()}
              style={[
                styles.card,
                { backgroundColor: c.cor },
                isMobile && { marginBottom: 10 },
              ]}
            >
              <Text style={styles.cardTitulo}>{c.titulo}</Text>
              <Text style={styles.cardValor}>{c.valor}</Text>
            </Animated.View>
          ))}
        </View>

        {/* 📦 Lista de encomendas */}
        <Text style={styles.secaoTitulo}>📦 Encomendas Recentes</Text>
        {recentes.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma encomenda registrada ainda.</Text>
        ) : (
          <FlatList
            data={recentes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const nomeMorador = item.morador
                ? `${item.morador.nome} ${item.morador.sobrenome}`
                : "—";
              const dataRef =
                item.retiradaEm || item.dataRegistro || item.dataRecebimento;

              return (
                <View style={styles.item}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTexto}>
                        <Text style={styles.bold}>Token:</Text>{" "}
                        {item.token || "—"}{" "}
                        <Text style={styles.bold}>| Origem:</Text>{" "}
                        {item.origem || "—"}
                      </Text>

                      <Text style={[styles.itemData, { marginTop: 6 }]}>
                        <Text style={styles.bold}>Morador:</Text>{" "}
                        {nomeMorador || "—"}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", marginLeft: 8 }}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() =>
                          router.push(`/encomendas/registrar?editId=${item.id}`)
                        }
                      >
                        <Text style={styles.actionText}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { marginLeft: 8 }]}
                        onPress={() => confirmarExcluirEncomenda(item.id)}
                      >
                        <Text style={styles.actionText}>Excluir</Text>
                      </TouchableOpacity>

                      {/* botão WhatsApp */}
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          { marginLeft: 8, backgroundColor: "#25D366" },
                        ]}
                        onPress={() => {
                          if (item.morador && item.morador.telefone) {
                            const nome = `${item.morador.nome} ${item.morador.sobrenome || ""}`.trim();
                            const msg = `Olá ${nome}! 📦\n\nSua encomenda de ${item.origem || "origem não informada"} chegou na portaria.\n\nToken para retirada: *${item.token}*.\n\nObrigado! 🏢`;
                            abrirWhatsApp(item.morador.telefone, msg);
                          } else {
                            notify("Atenção", "O morador não possui telefone cadastrado.");
                          }
                        }}
                      >
                        <Text style={[styles.actionText, { color: "#fff" }]}>
                          WhatsApp
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.itemData}>
                    {item.retirada
                      ? `✅ Retirada em ${formatarData(item.retiradaEm)}`
                      : `⏳ Recebida em ${formatarData(dataRef)}`}
                  </Text>
                </View>
              );
            }}
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
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginRight: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cardTitulo: { color: "#fff", fontSize: 16 },
  cardValor: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 10,
  },
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
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e6eef8",
    borderRadius: 6,
  },
  actionText: { color: "#0d47a1", fontWeight: "600", fontSize: 13 },
});
