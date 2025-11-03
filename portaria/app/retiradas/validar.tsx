// app/retiradas/validar.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RedirectValidar() {
  const router = useRouter();

  useEffect(() => {
    // Mantém compatibilidade com rota antiga, redireciona para a unificada
    router.replace("/validar-encomenda");
  }, []);

  return null;
}
