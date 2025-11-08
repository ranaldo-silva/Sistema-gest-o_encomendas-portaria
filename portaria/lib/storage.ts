export const API_BASE_URL = "https://apiportarialigth-production.up.railway.app";

// --------------------
// Tipos
// --------------------
export interface Morador {
  id?: number;
  nome: string;
  sobrenome: string;
  bloco: string;
  apartamento: string;
  telefone: string;
}

export interface Encomenda {
  id?: number;
  token?: string;
  origem?: string;
  retirada?: boolean;
  retiradaEm?: string;
  dataRecebimento?: string;
  descricao?: string;
  morador?: Morador | null;
}

// --------------------
// Moradores
// --------------------
export async function getMoradores(): Promise<Morador[]> {
  const res = await fetch(`${API_BASE_URL}/moradores`);
  return await res.json();
}

export async function saveMoradores(morador: Morador): Promise<Morador> {
  const res = await fetch(`${API_BASE_URL}/moradores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(morador),
  });
  return await res.json();
}

export async function updateMorador(
  id: string | number,
  morador: Partial<Morador>
): Promise<Morador> {
  try {
    const res = await fetch(`${API_BASE_URL}/moradores/${Number(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(morador),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch (_) {}

    if (!res.ok) {
      const msg =
        (data && data.message) ||
        (await res.text()) ||
        "Erro ao atualizar morador";
      throw new Error(msg);
    }

    return data || morador;
  } catch (err) {
    console.error("updateMorador error:", err);
    throw err;
  }
}

export async function deleteMorador(id: string | number): Promise<void> {
  await fetch(`${API_BASE_URL}/moradores/${Number(id)}`, {
    method: "DELETE",
  });
}

// --------------------
// Encomendas
// --------------------
export async function getEncomendas(): Promise<Encomenda[]> {
  const res = await fetch(`${API_BASE_URL}/encomendas`);
  const data = await res.json();

  return data.map((e: any) => ({
    id: e.id,
    token: e.token ?? "—",
    origem: e.origem ?? "—",
    retirada: e.retirada ?? false,
    retiradaEm: e.retiradaEm ?? null,
    dataRecebimento: e.dataRecebimento ?? null,
    descricao: e.descricao ?? "",
    morador: e.morador ?? null,
  }));
}

// Salvar encomenda
export async function saveEncomendas(encomenda: Partial<Encomenda>): Promise<Encomenda> {
  const res = await fetch(`${API_BASE_URL}/encomendas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encomenda),
  });

  if (!res.ok) {
    const msg = (await res.text()) || "Erro ao salvar encomenda";
    throw new Error(msg);
  }

  return await res.json();
}

// Atualizar encomenda
export async function updateEncomenda(
  id: string | number,
  encomenda: Partial<Encomenda>
): Promise<Encomenda> {
  const res = await fetch(`${API_BASE_URL}/encomendas/${Number(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encomenda),
  });

  if (!res.ok) {
    const msg = (await res.text()) || "Erro ao atualizar encomenda";
    throw new Error(msg);
  }

  return await res.json();
}

// ✅ NOVA: buscar encomenda por ID
export async function getEncomendaById(id: string | number): Promise<Encomenda> {
  const res = await fetch(`${API_BASE_URL}/encomendas`);
  const data = await res.json();
  return data.find((e: any) => e.id === Number(id));
}

// ✅ Já existente
export async function deleteEncomenda(id: string | number): Promise<void> {
  await fetch(`${API_BASE_URL}/encomendas/${Number(id)}`, {
    method: "DELETE",
  });
}


export async function confirmarRetirada(token: string): Promise<void> {
  const encomendaRes = await fetch(`${API_BASE_URL}/encomendas/token/${token}`);
  if (!encomendaRes.ok) throw new Error("Token inválido ou encomenda não encontrada.");

  const encomenda = await encomendaRes.json();

  const retirada = {
    morador: encomenda.morador
      ? `${encomenda.morador.nome} ${encomenda.morador.sobrenome}`
      : "Desconhecido",
    encomenda: encomenda.token,
  };

  const res = await fetch(`${API_BASE_URL}/retiradas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(retirada),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao registrar retirada");
  }

  console.log("✅ Retirada registrada com sucesso!");
}
