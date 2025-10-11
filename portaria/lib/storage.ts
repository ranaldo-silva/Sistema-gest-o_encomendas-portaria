// app/lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Morador = {
  id: string;
  nome: string;
  sobrenome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
};

export type Encomenda = {
  id: string;
  moradorId: string;
  origem: string;
  token: string;
  data: string;
  retirada?: boolean;
  retiradaEm?: string;
};

const KEY_MORADORES = "@moradores";
const KEY_ENCOMENDAS = "@encomendas";

export async function getMoradores(): Promise<Morador[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_MORADORES);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("getMoradores error", err);
    return [];
  }
}

export async function saveMoradores(list: Morador[]) {
  try {
    await AsyncStorage.setItem(KEY_MORADORES, JSON.stringify(list));
  } catch (err) {
    console.error("saveMoradores error", err);
    throw err;
  }
}

export async function getEncomendas(): Promise<Encomenda[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_ENCOMENDAS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("getEncomendas error", err);
    return [];
  }
}

export async function saveEncomendas(list: Encomenda[]) {
  try {
    await AsyncStorage.setItem(KEY_ENCOMENDAS, JSON.stringify(list));
  } catch (err) {
    console.error("saveEncomendas error", err);
    throw err;
  }
}
