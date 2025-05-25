import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
      id: uuidv4(),
      nome,
      cpf,
      tipoUsuario,
      email,
      senha,
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
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholder="Digite seu nome"
      />
      <Text style={styles.label}>CPF:</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
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
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        placeholder="Digite seu email"
      />
      <Text style={styles.label}>Senha:</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        placeholder="Digite sua senha"
      />
      <Button title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/welcome")}>
        <Text style={{ marginTop: 10, color: "blue" }}>Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    borderRadius: 4,
  },
  link: {
    marginTop: 10,
    color: "blue",
    textAlign: "center",
  },
});
