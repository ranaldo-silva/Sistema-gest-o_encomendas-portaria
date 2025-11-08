import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Sidebar from "../../components/Sidebar";
import {
  getMoradores,
  getEncomendas,
  saveEncomendas,
  updateEncomenda,
  getEncomendaById,
  Encomenda,
  Morador,
} from "../../lib/storage";
import { abrirWhatsApp } from "../../lib/whatsapp"; 

export default function RegistrarEncomenda() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;

  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [selectedMoradorId, setSelectedMoradorId] = useState<string>("");
  const [origem, setOrigem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filtro, setFiltro] = useState("");
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    if (editId) {
      (async () => {
        try {
          const e = await getEncomendaById(editId);
          setSelectedMoradorId(e.morador ? String(e.morador.id) : "");
          setOrigem(e.origem || "");
          setDescricao(e.descricao || "");
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [editId]);

  async function carregar() {
    const ms = await getMoradores();
    setMoradores(ms);
    const es = await getEncomendas();
    setEncomendas(es);
  }

  const moradoresFiltraveis = moradores.filter((m) => {
    const q = filtro.trim().toLowerCase();
    if (!q) return true;
    const nomeCompleto = `${m.nome} ${m.sobrenome}`.toLowerCase();
    return nomeCompleto.includes(q) || m.bloco.toLowerCase().includes(q);
  });

  async function salvar() {
    if (!selectedMoradorId)
      return Alert.alert("Atenção", "Selecione um morador.");
    if (!origem) return Alert.alert("Atenção", "Preencha a origem.");

    try {
      let resultado: Encomenda;

      if (editId) {
        resultado = await updateEncomenda(editId, {
          moradorId: Number(selectedMoradorId),
          origem,
          descricao,
        });
        Alert.alert("Sucesso", "Encomenda atualizada.");
      } else {
        resultado = await saveEncomendas({
          moradorId: Number(selectedMoradorId),
          origem,
          descricao,
        });
        Alert.alert("Sucesso", "Encomenda registrada.");

        // Após salvar, enviar notificação por WhatsApp
        const morador = moradores.find((m) => m.id === Number(selectedMoradorId));
        if (morador?.telefone) {
          const mensagem = `📦 Olá ${morador.nome}! Sua encomenda (${origem}) chegou na portaria.\nToken: ${resultado.token}\nHorário: ${new Date().toLocaleString()}`;
          abrirWhatsApp(morador.telefone, mensagem);
        }
      }

      router.push("/");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err.message || "Falha ao salvar encomenda.");
    }
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={[styles.areaConteudo, isMobile && { padding: 16 }]}>
        <Text style={styles.titulo}>
          {editId ? "Editar Encomenda" : "Registrar Encomenda"}
        </Text>

        <Text style={styles.label}>Pesquisar morador (nome ou bloco)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Maria ou bloco A"
          value={filtro}
          onChangeText={setFiltro}
        />

        <Text style={styles.label}>Selecionar Morador</Text>
        <View style={{ maxHeight: 220 }}>
          <FlatList
            data={moradoresFiltraveis}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedMoradorId(String(item.id))}
                style={[
                  styles.moradorItem,
                  selectedMoradorId === String(item.id) &&
                    styles.moradorItemSelected,
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {item.nome} {item.sobrenome}
                </Text>
                <Text style={{ color: "#475569" }}>
                  Bloco {item.bloco} • Ap. {item.apartamento}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <Text style={styles.label}>Origem</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Shopee, Mercado Livre..."
          value={origem}
          onChangeText={setOrigem}
        />

        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <TouchableOpacity style={styles.botao} onPress={salvar}>
          <Text style={styles.textoBotao}>
            {editId ? "Salvar Alterações" : "Registrar Encomenda"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f8fafc" },
  areaConteudo: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#0d47a1", marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 6, color: "#334155" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  moradorItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e6eef8",
  },
  moradorItemSelected: {
    borderColor: "#1976d2",
    backgroundColor: "#eaf3ff",
  },
  botao: {
    backgroundColor: "#0d47a1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  textoBotao: { color: "#fff", fontWeight: "600" },
});
