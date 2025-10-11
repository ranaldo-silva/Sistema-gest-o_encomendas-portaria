import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="moradores/cadastrar" />
      <Stack.Screen name="encomendas/registrar" />
      <Stack.Screen name="validar-encomenda" />
    </Stack>
  );
}
