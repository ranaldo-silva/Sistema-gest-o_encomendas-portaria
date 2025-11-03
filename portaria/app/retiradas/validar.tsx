// app/retiradas/validar.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RedirectValidar() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/validar-encomenda");
  }, []);

  return null;
}
