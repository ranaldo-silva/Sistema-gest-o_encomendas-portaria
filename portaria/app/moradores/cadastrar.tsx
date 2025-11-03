import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Sidebar from "../../components/Sidebar";
import {
  getMoradores,
  saveMoradores,
  updateMorador,
  deleteMorador,
} from "../../lib/storage";
import { notify, confirmBrowser } from "../../utils/notify";

export default function CadastrarMorador() {
  const [moradores, setMoradores] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [bloco, setBloco] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroBloco, setFiltroBloco] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const lista = await getMoradores();
    setMoradores(lista);
  }

  const moradoresFiltrados = moradores.filter((m) => {
    const nomeCompleto = `${m.nome} ${m.sobrenome}`.toLowerCase();
    const matchesNome =
      filtroNome.trim() === "" || nomeCompleto.includes(filtroNome.toLowerCase());
    const matchesBloco =
      filtroBloco.trim() === "" ||
      m.bloco.toLowerCase() === filtroBloco.toLowerCase();
    return matchesNome && matchesBloco;
  });

  function iniciarEdicao(morador: any) {
    setEditId(String(morador.id));
    setNome(morador.nome);
    setSobrenome(morador.sobrenome);
    setBloco(morador.bloco);
    setApartamento(morador.apartamento);
    setTelefone(morador.telefone);
  }

  function cancelarEdicao() {
    limparFormulario();
    setEditId(null);
  }

  async function handleCadastrar() {
    if (!nome || !sobrenome || !bloco || !apartamento || !telefone) {
      return notify("Atenção", "Preencha todos os campos!");
    }

    try {
      if (editId) {
        await updateMorador(editId, {
          nome,
          sobrenome,
          bloco,
          apartamento,
          telefone,
        });
        notify("Sucesso", "Morador atualizado com sucesso!");
        setEditId(null);
      } else {
        await saveMoradores({ nome, sobrenome, bloco, apartamento, telefone });
        notify("Sucesso", "Morador cadastrado com sucesso!");
      }
      limparFormulario();
      await carregar();
    } catch (err: any) {
      console.error("Erro ao salvar morador:", err);
      notify("Erro", err.message || "Falha ao salvar morador.");
    }
  }

  function limparFormulario() {
    setNome("");
    setSobrenome("");
    setBloco("");
    setApartamento("");
    setTelefone("");
  }

  async function handleExcluirMorador(id: string) {
    const ok = await confirmBrowser("Deseja excluir este morador?");
    if (!ok) return;

    try {
      await deleteMorador(id);
      notify("Sucesso", "Morador excluído com sucesso!");
      await carregar();
    } catch (err: any) {
      console.error("Erro ao excluir morador:", err.message ?? err);
      notify("Erro", err.message || "Falha ao excluir morador.");
    }
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={styles.areaConteudo}>
        <Text style={styles.titulo}>
          {editId ? "Editar Morador" : "Novo Morador"}
        </Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          value={sobrenome}
          onChangeText={setSobrenome}
        />

        <Text style={styles.label}>Bloco</Text>
        <TextInput
          style={styles.input}
          value={bloco ?? ""}
          onChangeText={(txt) => setBloco(txt)}
        />

        <Text style={styles.label}>Apartamento</Text>
        <TextInput
          style={styles.input}
          value={apartamento}
          onChangeText={setApartamento}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Telefone (WhatsApp)</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.botaoCadastrar} onPress={handleCadastrar}>
          <Text style={styles.textoBotao}>
            {editId ? "Salvar Alterações" : "Cadastrar Morador"}
          </Text>
        </TouchableOpacity>

        {editId && (
          <TouchableOpacity
            style={[
              styles.botaoCadastrar,
              { backgroundColor: "#ddd", marginTop: 6 },
            ]}
            onPress={cancelarEdicao}
          >
            <Text style={[styles.textoBotao, { color: "#333" }]}>Cancelar</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.titulo, { marginTop: 20 }]}>Lista de Moradores</Text>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por nome..."
          value={filtroNome}
          onChangeText={setFiltroNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Filtrar por bloco (ex: A)"
          value={filtroBloco}
          onChangeText={setFiltroBloco}
        />

        {moradoresFiltrados.map((m) => (
          <View key={m.id} style={styles.itemContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNome}>
                {m.nome} {m.sobrenome}
              </Text>
              <Text style={styles.itemInfo}>
                Bloco {m.bloco} • Ap. {m.apartamento} • {m.telefone}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => iniciarEdicao(m)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { marginLeft: 8 }]}
                onPress={() => handleExcluirMorador(String(m.id))}
              >
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#f8fafc" },
  areaConteudo: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#0d47a1", marginBottom: 15 },
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
  itemContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemNome: { fontWeight: "bold", fontSize: 15 },
  itemInfo: { color: "#475569", marginTop: 4 },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#e6eef8",
    borderRadius: 6,
  },
  actionText: { color: "#0d47a1", fontWeight: "600", fontSize: 13 },
});
