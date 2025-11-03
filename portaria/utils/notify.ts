// utils/notify.ts
import { Alert, Platform } from "react-native";

export function notify(title: string, message?: string) {
  const text = message ?? "";
  // sempre loga no console para debug em web e mobile
  console.log(`${title}${text ? " — " + text : ""}`);

  if (Platform.OS === "web") {
    // fallback simples no browser
    try {
      // use window.alert para mensagens simples e confirm para confirmações onde necessário
      window.alert(`${title}${text ? "\n\n" + text : ""}`);
    } catch (e) {
      // se window não existir por algum motivo, use console
      console.log("notify window.alert falhou:", e);
    }
  } else {
    // mobile
    Alert.alert(title, text);
  }
}

export function confirmBrowser(message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    const ok = window.confirm(message);
    return Promise.resolve(ok);
  }
  // no mobile continuará usando Alert.confirm style pattern by caller
  // return resolved true to allow caller decide alternative flow
  return Promise.resolve(true);
}
