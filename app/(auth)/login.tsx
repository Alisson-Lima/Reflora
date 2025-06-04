/* eslint-disable import/no-unresolved */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <View style={styles.container}>
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 700,
    minWidth:500,
    height: "50%",
    marginHorizontal: "auto",
    marginVertical: 30,
    backgroundColor: "#2a6f2b",
    minHeight: "50%",

    
    borderRadius: 16,
    
  },
});