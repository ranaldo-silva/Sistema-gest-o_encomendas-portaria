import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sidebar from "../../components/Sidebar";

type Morador = {
  id: string;
  nome: string;
  sobrenome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
};

type Encomenda = {
  id: string;
  moradorId: string;
  origem: string;
  token: string;
  data: string;
};

export default function RegistrarEncomenda() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [moradorSelecionado, setMoradorSelecionado] = useState("");
  const [origem, setOrigem] = useState("");
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);

  // 🔄 Carregar moradores e encomendas salvas
  useEffect(() => {
    async function carregarDados() {
      try {
        const jsonMoradores = await AsyncStorage.getItem("@moradores");
        if (jsonMoradores) setMoradores(JSON.parse(jsonMoradores));

        const jsonEncomendas = await AsyncStorage.getItem("@encomendas");
        if (jsonEncomendas) setEncomendas(JSON.parse(jsonEncomendas));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }
    carregarDados();
  }, []);

  // 💾 Salvar encomendas
  async function salvarEncomendas(lista: Encomenda[]) {
    try {
      await AsyncStorage.setItem("@encomendas", JSON.stringify(lista));
    } catch (err) {
      console.error("Erro ao salvar encomendas:", err);
      Alert.alert("Erro", "Falha ao salvar a encomenda localmente.");
    }
  }

  // 🔐 Gerar token
  function gerarToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 📨 Registrar encomenda
  async function handleRegistrar() {
    try {
      if (!moradorSelecionado || !origem) {
        Alert.alert("Atenção", "Selecione o morador e a origem da encomenda!");
        return;
      }

      const token = gerarToken();
      const novaEncomenda: Encomenda = {
        id: Date.now().toString(),
        moradorId: moradorSelecionado,
        origem,
        token,
        data: new Date().toLocaleString(),
      };

      const listaAtualizada = [...encomendas, novaEncomenda];
      setEncomendas(listaAtualizada);
      await salvarEncomendas(listaAtualizada);

      const morador = moradores.find((m) => m.id === moradorSelecionado);
      Alert.alert(
        "Encomenda Registrada",
        `Encomenda para ${morador?.nome} ${morador?.sobrenome}\nToken: ${token}\n\nNotificação simulada enviada.`
      );

      setMoradorSelecionado("");
      setOrigem("");
    } catch (err) {
      console.error("Erro ao registrar encomenda:", err);
      Alert.alert("Erro", "Falha ao registrar encomenda.");
    }
  }

  // 🧾 Moradores agrupados para visualização
  const moradoresAgrupados = moradores.reduce(
    (acc: Record<string, Morador[]>, morador) => {
      const chave = `${morador.bloco}-${morador.apartamento}`;
      if (!acc[chave]) acc[chave] = [];
      acc[chave].push(morador);
      return acc;
    },
    {}
  );

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={styles.areaConteudo}>
        <Text style={styles.titulo}>Registrar Encomenda</Text>
        <Text style={styles.subtitulo}>
          Registre uma nova encomenda recebida na portaria
        </Text>

        <Text style={styles.label}>Morador (Destinatário)</Text>
        <ScrollView style={styles.listaMoradores}>
          {Object.entries(moradoresAgrupados).map(([chave, lista]) => {
            const [b, ap] = chave.split("-");
            return (
              <View key={chave} style={styles.blocoCard}>
                <Text style={styles.tituloBloco}>
                  Bloco {b} - Apto {ap}
                </Text>
                {lista.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.itemMorador,
                      moradorSelecionado === m.id && styles.moradorSelecionado,
                    ]}
                    onPress={() => setMoradorSelecionado(m.id)}
                  >
                    <Text style={styles.nomeMorador}>
                      {m.nome} {m.sobrenome}
                    </Text>
                    <Text style={styles.telefone}>{m.telefone}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Origem da Encomenda</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Shopee, Mercado Livre, Shein..."
          value={origem}
          onChangeText={setOrigem}
        />

        <TouchableOpacity style={styles.botaoRegistrar} onPress={handleRegistrar}>
          <Text style={styles.textoBotao}>Registrar Encomenda</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f8fafc" },
  areaConteudo: { flex: 1, padding: 20 },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 5,
  },
  subtitulo: {
    color: "#475569",
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    color: "#334155",
    marginTop: 15,
    marginBottom: 5,
  },
  listaMoradores: {
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 10,
  },
  blocoCard: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  tituloBloco: {
    fontWeight: "bold",
    color: "#0d47a1",
    marginBottom: 5,
  },
  itemMorador: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginBottom: 6,
  },
  moradorSelecionado: {
    backgroundColor: "#dbeafe",
    borderColor: "#0d47a1",
    borderWidth: 1,
  },
  nomeMorador: { fontWeight: "600", color: "#1e293b" },
  telefone: { fontSize: 13, color: "#64748b" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  botaoRegistrar: {
    backgroundColor: "#0d47a1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
