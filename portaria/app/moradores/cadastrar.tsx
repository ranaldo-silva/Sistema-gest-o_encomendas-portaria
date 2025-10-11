import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

export default function CadastrarMorador() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [bloco, setBloco] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [busca, setBusca] = useState("");

  // 🔄 Carregar dados salvos ao abrir
  useEffect(() => {
    async function carregarMoradores() {
      try {
        const json = await AsyncStorage.getItem("@moradores");
        if (json) setMoradores(JSON.parse(json));
      } catch (err) {
        console.error("Erro ao carregar moradores:", err);
      }
    }
    carregarMoradores();
  }, []);

  // 💾 Salvar no AsyncStorage
  async function salvarMoradores(lista: Morador[]) {
    try {
      await AsyncStorage.setItem("@moradores", JSON.stringify(lista));
    } catch (err) {
      console.error("Erro ao salvar moradores:", err);
      Alert.alert("Erro", "Falha ao salvar os dados localmente.");
    }
  }

  // ➕ Cadastrar novo morador
  async function handleCadastrar() {
    try {
      if (!nome || !sobrenome || !bloco || !apartamento || !telefone) {
        Alert.alert("Atenção", "Preencha todos os campos!");
        return;
      }

      const moradoresMesmoAp = moradores.filter(
        (m) => m.bloco === bloco && m.apartamento === apartamento
      );

      if (moradoresMesmoAp.length >= 3) {
        Alert.alert(
          "Limite atingido",
          "Cada apartamento pode ter no máximo 3 moradores cadastrados."
        );
        return;
      }

      const novoMorador: Morador = {
        id: Date.now().toString(),
        nome,
        sobrenome,
        bloco,
        apartamento,
        telefone,
      };

      const listaAtualizada = [...moradores, novoMorador];
      setMoradores(listaAtualizada);
      await salvarMoradores(listaAtualizada);

      setNome("");
      setSobrenome("");
      setBloco("");
      setApartamento("");
      setTelefone("");

      Alert.alert("Sucesso", "Morador cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar o morador.");
    }
  }

  // 🗑️ Remover morador
  async function handleRemover(id: string) {
    try {
      Alert.alert("Confirmar", "Deseja remover este morador?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const listaAtualizada = moradores.filter((m) => m.id !== id);
            setMoradores(listaAtualizada);
            await salvarMoradores(listaAtualizada);
          },
        },
      ]);
    } catch (err) {
      console.error("Erro ao remover morador:", err);
      Alert.alert("Erro", "Não foi possível remover o morador.");
    }
  }

  // 🔍 Filtrar moradores
  const moradoresFiltrados = moradores.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.sobrenome.toLowerCase().includes(busca.toLowerCase()) ||
      m.apartamento.includes(busca) ||
      m.bloco.toLowerCase().includes(busca.toLowerCase())
  );

  // Agrupar por apartamento
  const moradoresAgrupados = moradoresFiltrados.reduce(
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
        <Text style={styles.titulo}>Novo Morador</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Silva"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Text style={styles.label}>Bloco</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: A"
          value={bloco}
          onChangeText={setBloco}
        />

        <Text style={styles.label}>Apartamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 101"
          value={apartamento}
          onChangeText={setApartamento}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Telefone (WhatsApp)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: (11) 99999-9999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar}>
          <Text style={styles.textoBotao}>Cadastrar Morador</Text>
        </TouchableOpacity>

        {/* Busca */}
        <Text style={styles.subtitulo}>Moradores Cadastrados</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nome, bloco ou apartamento..."
          value={busca}
          onChangeText={setBusca}
        />

        {Object.entries(moradoresAgrupados).map(([chave, lista]) => {
          const [b, ap] = chave.split("-");
          return (
            <View key={chave} style={styles.cardApartamento}>
              <Text style={styles.cardTitulo}>
                Bloco {b} - Apartamento {ap}
              </Text>
              <Text style={styles.cardSub}>{lista.length}/3 moradores</Text>

              {lista.map((m) => (
                <View key={m.id} style={styles.itemMorador}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTexto}>
                      {m.nome[0]}
                      {m.sobrenome[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nomeMorador}>
                      {m.nome} {m.sobrenome}
                    </Text>
                    <Text style={styles.telefone}>{m.telefone}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() => handleRemover(m.id)}
                  >
                    <Text style={styles.textoRemover}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
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
    marginBottom: 15,
  },
  label: { fontWeight: "600", fontSize: 14, color: "#334155", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  botaoCadastrar: {
    backgroundColor: "#0d47a1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "600", fontSize: 16 },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d47a1",
    marginVertical: 20,
  },
  cardApartamento: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTitulo: { fontWeight: "700", fontSize: 16, color: "#1e293b" },
  cardSub: { color: "#64748b", fontSize: 13, marginBottom: 10 },
  itemMorador: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    backgroundColor: "#e0e7ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarTexto: { color: "#0d47a1", fontWeight: "bold", fontSize: 16 },
  nomeMorador: { fontWeight: "600", fontSize: 15, color: "#1e293b" },
  telefone: { color: "#64748b" },
  botaoRemover: { padding: 5 },
  textoRemover: { fontSize: 22 },
});
