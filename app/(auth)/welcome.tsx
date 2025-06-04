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
    maxWidth: 700,
    minWidth:500,
    height: 500,
    marginHorizontal: "auto",
    marginVertical: 30,
    backgroundColor: "#2a6f2b",
    minHeight: "50%",

    
    borderRadius: 16,
    
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#eef2e3",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#eef2e3",
    opacity:0.8,
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
