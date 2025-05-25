import { useAuthStore } from "@/store/authStore";
import { useMissionsStore } from "@/store/missionsStore";
import { Mission } from "@/types/index";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

// Lista estática de locais disponíveis
const localsAvailable = [
  { id: "loc001", localName: "Centro de Reciclagem Norte" },
  { id: "loc002", localName: "Ponto de Coleta Sul" },
  { id: "loc003", localName: "Estação Ambiental Leste" },
  { id: "loc004", localName: "Coop Recicla Oeste" },
];

export default function CreateMission() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocalId, setSelectedLocalId] = useState<string>(
    localsAvailable[0].id
  );
  const [rewardPoints, setRewardPoints] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const { user, login, addMovimentation } = useAuthStore();
  const { createMission } = useMissionsStore();

  const handleConfirm = () => {
    if (!name || !description || !rewardPoints) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    const points = parseInt(rewardPoints, 10);
    if (isNaN(points) || points <= 0) {
      Alert.alert("Erro", "Insira uma pontuação válida maior que zero.");
      return;
    }
    setModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário logado.");
      setModalVisible(false);
      return;
    }

    // Valida a senha
    const isValid = await login(user.email, password);
    if (!isValid) {
      Alert.alert("Erro", "Senha incorreta. Tente novamente.");
      setPassword("");
      return;
    }

    // Cria a missão
    const selectedLocal = localsAvailable.find((l) => l.id === selectedLocalId);
    if (!selectedLocal) {
      Alert.alert("Erro", "Local selecionado inválido.");
      setModalVisible(false);
      return;
    }

    const newMission: Mission = {
      id: uuidv4(),
      nome: name,
      descricao: description,
      localEntrega: selectedLocal.localName,
      valorReward: parseInt(rewardPoints, 10),
      idParceiro: user.id,
    };

    const success = await createMission(newMission);
    if (success) {
      // Adiciona movimentação
      await addMovimentation({
        type: "create-mission",
        description: `Criou a missão "${name}" com ${newMission.valorReward} pontos`,
      });
      Alert.alert("Sucesso", `Missão "${name}" criada com sucesso!`);
      setModalVisible(false);
      router.push("/");
    } else {
      Alert.alert("Erro", "Falha ao criar a missão.");
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Missão:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Digite o nome da missão"
      />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        placeholder="Digite a descrição (ex. Guardar 2 garrafas PET)"
        multiline
      />
      <Text style={styles.label}>Local de Entrega:</Text>
      <Picker
        selectedValue={selectedLocalId}
        onValueChange={(value) => setSelectedLocalId(value)}
        style={styles.picker}
      >
        {localsAvailable.map((local) => (
          <Picker.Item
            key={local.id}
            label={local.localName}
            value={local.id}
          />
        ))}
      </Picker>
      <Text style={styles.label}>Pontuação (Pontos):</Text>
      <TextInput
        value={rewardPoints}
        onChangeText={setRewardPoints}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Digite a pontuação"
      />
      <Button title="Confirmar" onPress={handleConfirm} />
      <Button title="Voltar" onPress={() => router.push("/")} />

      {/* Modal para confirmação de senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirme sua Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              placeholder="Digite sua senha"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setPassword("");
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
