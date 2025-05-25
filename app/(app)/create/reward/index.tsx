import { useAuthStore } from "@/store/authStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { Reward } from "@/types/index";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

// Lista estática de produtos disponíveis
const productsAvailable = [
  { id: "000001", nome: "Cupom R$5,00 do iFood", valor: 5000, points: 500 },
  {
    id: "000002",
    nome: "GiftCard de R$5,00 PlayStore",
    valor: 5000,
    points: 500,
  },
  { id: "000003", nome: "1 mês Spotify", valor: 24000, points: 2400 },
];

export default function CreateReward() {
  const [investment, setInvestment] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string>(
    productsAvailable[0].id
  );
  const [quantity, setQuantity] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isInvalidInvestment, setIsInvalidInvestment] = useState(false);
  const { user, login, addMovimentation } = useAuthStore();
  const { createReward } = useRewardsStore();

  // Calcula a quantidade de recompensas e valida o investimento mínimo
  useEffect(() => {
    const value = parseFloat(investment) * 100 || 0; // Converte para centavos
    const selectedProduct = productsAvailable.find(
      (p) => p.id === selectedProductId
    );
    const productValue = selectedProduct?.valor || 1;
    const calculatedQuantity = Math.floor(value / productValue);
    setQuantity(calculatedQuantity);

    const minInvestment = Math.min(...productsAvailable.map((p) => p.valor));
    setIsInvalidInvestment(value > 0 && value < minInvestment);
  }, [investment, selectedProductId]);

  const handleConfirm = () => {
    if (!investment || !selectedProductId) {
      Alert.alert(
        "Erro",
        "Por favor, preencha o valor do investimento e selecione um produto."
      );
      return;
    }
    if (isInvalidInvestment) {
      const minInvestment =
        Math.min(...productsAvailable.map((p) => p.valor)) / 100;
      Alert.alert(
        "Erro",
        `Investimento mínimo de R$${minInvestment.toFixed(2)}`
      );
      return;
    }
    if (quantity === 0) {
      Alert.alert(
        "Erro",
        "O valor do investimento é insuficiente para financiar uma recompensa."
      );
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

    // Cria o reward
    const selectedProduct = productsAvailable.find(
      (p) => p.id === selectedProductId
    );
    if (!selectedProduct) {
      Alert.alert("Erro", "Produto selecionado inválido.");
      setModalVisible(false);
      return;
    }

    const newReward: Reward = {
      id: uuidv4(),
      nome: selectedProduct.nome,
      valor: selectedProduct.points * quantity,
      idParceiro: user.id,
      unidadesRestantes: quantity,
    };

    const success = await createReward(newReward);
    if (success) {
      // Adiciona movimentação
      await addMovimentation({
        type: "create-reward",
        description: `Financiou ${quantity} unidade(s) de "${
          selectedProduct.nome
        }" por ${selectedProduct.points * quantity} pontos`,
      });
      Alert.alert(
        "Sucesso",
        `Recompensa "${selectedProduct.nome}" financiada com sucesso!`
      );
      setModalVisible(false);
      router.push("/");
    } else {
      Alert.alert("Erro", "Falha ao criar a recompensa.");
      setModalVisible(false);
    }
  };

  const minInvestment =
    Math.min(...productsAvailable.map((p) => p.valor)) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Valor do Investimento (R$):</Text>
      <TextInput
        value={investment}
        onChangeText={setInvestment}
        style={[styles.input, isInvalidInvestment && styles.invalidInput]}
        keyboardType="numeric"
        placeholder="Digite o valor"
      />
      {isInvalidInvestment && (
        <Text style={styles.errorText}>
          Investimento mínimo de R${minInvestment.toFixed(2)}
        </Text>
      )}
      <Text style={styles.label}>Recompensa:</Text>
      <Picker
        selectedValue={selectedProductId}
        onValueChange={(value) => setSelectedProductId(value)}
        style={styles.picker}
      >
        {productsAvailable.map((product) => (
          <Picker.Item
            key={product.id}
            label={`${product.nome} (R$${product.valor / 100}, ${
              product.points
            } pontos)`}
            value={product.id}
          />
        ))}
      </Picker>
      <Text style={styles.info}>
        Quantidade Financiada: {quantity}{" "}
        {quantity === 1 ? "unidade" : "unidades"}
      </Text>
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
  invalidInput: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    borderRadius: 4,
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginVertical: 16,
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
