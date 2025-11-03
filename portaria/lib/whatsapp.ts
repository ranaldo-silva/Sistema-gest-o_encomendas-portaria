// lib/whatsapp.ts
export function abrirWhatsApp(numero: string, mensagem: string) {
  if (!numero) {
    alert("Número de telefone não informado.");
    return;
  }

  const numLimpo = numero.replace(/\D/g, "");
  const numeroFinal = numLimpo.startsWith("55") ? numLimpo : `55${numLimpo}`;
  const msg = encodeURIComponent(mensagem || "Olá!");

  const link = `https://wa.me/${numeroFinal}?text=${msg}`;

  if (typeof window !== "undefined") {
    window.open(link, "_blank");
    console.log("✅ WhatsApp aberto:", link);
  } else {
    console.log("Abra este link no navegador:", link);
  }
}
