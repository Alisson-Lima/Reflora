import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(auth)/welcome"
        options={{
          title: "Bem-vindo",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ title: "Cadastrar", headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="/create/reward"
        options={{ title: "Create new reward", headerShown: false }}
      />
      <Stack.Screen
        name="/create/mission"
        options={{ title: "Create new mission", headerShown: false }}
      />
      <Stack.Screen
        name="/movements"
        options={{ title: "Your Movements", headerShown: false }}
      />
      <Stack.Screen
        name="/colaborador"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="/parceiro"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="/voluntario"
        options={{ title: "Dashboard", headerShown: false }}
      />
      <Stack.Screen
        name="/rewards"
        options={{ title: "Available Rewards", headerShown: false }}
      />
    </Stack>
  );
}
