/* eslint-disable import/no-unresolved */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuthStore();

  const handleLogin = async () => {
    const ok = await login(email, senha);
    if (!ok) {
      alert("Credenciais inválidas");
    } else {
      router.push("/(app)");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Email:</Text>
      <Input
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <Text>Senha:</Text>
      <Input
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <View style={{ gap: 8, marginTop: 16 }}>
        <Button onPress={handleLogin}>Entrar</Button>
        <Button
          onPress={() => router.push("/(auth)/register")}
          variant="secondary"
        >
          Cadastrar
        </Button>
        <Button
          onPress={() => router.push("/(auth)/welcome")}
          variant="secondary"
        >
          Inicio
        </Button>
      </View>
    </View>
  );
}
