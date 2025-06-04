import ChoseLoginButton from "@/components/ChoseLoginButton";
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
        <ChoseLoginButton
          iconName="log-in"
          onPress={() => router.push("/(auth)/login")}
          text="Fazer Login"
          buttonText="Fazer Login"
        />
        <ChoseLoginButton
          iconName="user-plus"
          onPress={() => router.push("/(auth)/register")}
          text="Criar Conta"
          buttonText="Criar conta"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#252525",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#474747",
    marginBottom: 32,
    textAlign: "center",
  },
});
