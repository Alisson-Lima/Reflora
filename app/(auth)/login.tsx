/* eslint-disable import/no-unresolved */
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <Text>Senha:</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 8 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ marginTop: 10, color: "blue" }}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/welcome")}>
        <Text style={{ marginTop: 10, color: "blue" }}>Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}
