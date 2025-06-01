import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Reflora</Text>
      <Text style={styles.subtitle}>
        Faça login ou cadastre-se para começar!
      </Text>
      <View style={{ width: "100%", gap: 8 }}>
        <Button
          onPress={() => router.push("/(auth)/login")}
          style={{ width: "100%" }}
        >
          Fazer Login
        </Button>
        <Button
          onPress={() => router.push("/(auth)/register")}
          style={{ width: "100%" }}
        >
          Fazer Cadastro
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
