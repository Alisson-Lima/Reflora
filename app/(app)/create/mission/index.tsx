import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { Input } from "@/components/ui/Input";
import { CollectAreas } from "@/mocks/CollectAreas";
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
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

// Lista estática de locais disponíveis
const localsAvailable = CollectAreas;

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
      local: selectedLocal.nome,
      points: parseInt(rewardPoints, 10),
      idParceiro: user.id,
      codigoVerificador: selectedLocal.codigoVerificador,
    };

    const success = await createMission(newMission);
    if (success) {
      // Adiciona movimentação
      await addMovimentation({
        type: "create-mission",
        description: `Criou a missão "${name}" com ${newMission.points} pontos`,
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
    <ScrollView>   
       <Container>    
        <View>
      <Text style={styles.label}>Nome da Missão:</Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Digite o nome da missão"
      />
      <Text style={styles.label}>Descrição:</Text>
      <Input
        value={description}
        onChangeText={setDescription}
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
          <Picker.Item key={local.id} label={local.nome} value={local.id} />
        ))}
      </Picker>
      <Text style={styles.label}>Pontuação (Pontos):</Text>
      <Input style={styles.input}
        value={rewardPoints}
        onChangeText={setRewardPoints}
        keyboardType="numeric"
        placeholder="Digite a pontuação"
      />
      <GridDashboard.Actions label="Confirmar" onPress={handleConfirm}/>  
      <GridDashboard.Actions label="Voltar" onPress={() => router.push("/")}/>


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
            <Input
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


              <GridDashboard.Actions label="Confirmar" onPress={handlePasswordSubmit}/>              
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </Container>
    </ScrollView>

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
    marginBottom: 10,
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
    padding: 10,
    marginBottom: 10,
    color: "white",
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
