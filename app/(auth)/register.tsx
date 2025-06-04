import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../store/authStore"; // Ajuste o caminho conforme necessário
import { User, UserTypes } from "../types";

export default function Register() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<UserTypes>("colaborador");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { register } = useAuthStore();

  const handleRegister = async () => {
    // Validação de campos obrigatórios
    if (!nome || !cpf || !tipoUsuario || !email || !senha) {
      Alert.alert(
        "Erro",
        "Todos os campos são obrigatórios. Por favor, preencha todos os dados."
      );
      return;
    }

    const newUser: User = {
      points: 0,
      createdAt: new Date().toISOString(),
      id: uuidv4(),
      nome,
      cpf,
      tipoUsuario,
      email,
      senha,
      movimentations: [],
      jobs: [],
      missions: [],
    };
    const ok = await register(newUser);
    if (!ok) {
      Alert.alert("Erro ao cadastrar", "Email já existe ou dados inválidos.");
    } else {
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.push("/(auth)/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <Input
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
      />
      <Text style={styles.label}>CPF:</Text>
      <Input
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        placeholder="Digite seu CPF"
      />
      <Text style={styles.label}>Tipo de Usuário:</Text>
      <Picker
        selectedValue={tipoUsuario}
        onValueChange={(value) => setTipoUsuario(value)}
        style={styles.picker}
      >
        <Picker.Item label="Colaborador" value="colaborador" />
        <Picker.Item label="Voluntário" value="voluntario" />
        <Picker.Item label="Parceiro" value="parceiro" />{" "}
      </Picker>
      <Text style={styles.label}>Email:</Text>
      <Input
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Digite seu email"
      />
      <Text style={styles.label}>Senha:</Text>
      <Input
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholder="Digite sua senha"
      />
      <View
        style={{
          flexDirection: "column",
          width: "100%",
          gap: 8,
          marginTop: 16,
        }}
      >
        <Button onPress={handleRegister}>Cadastrar</Button>
        <Button
          onPress={() => router.push("/(auth)/login")}
          variant="secondary"
        >
          Já tenho conta
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
    alignItems: "flex-start",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eef2e3",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "#eef2e3",
  },
  picker: {
    borderWidth: 1,
    height: 30,
    borderColor: "#eef2e3",
    marginBottom: 8,
    borderRadius: 4,
    width: "100%",
  },
  link: {
    marginTop: 10,
    color: "blue",
    textAlign: "center",
  },
});
