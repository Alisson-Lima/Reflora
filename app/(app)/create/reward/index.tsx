import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { Reward } from "@/types/index";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

const colors = {
  foreground: "#09090B", // Cor do texto principal (slate-900)
  mutedForeground: "#71717A", // Cor do placeholder (slate-500)
  primary: "#3B82F6", // Azul primário (blue-500) - para seleção e foco
  primaryForeground: "#FFFFFF", // Texto sobre o primário (branco)
  inputBackground: "transparent", // Fundo do input (transparente por padrão)
  // darkInputBackground: 'rgba(55, 65, 81, 0.3)', // Ex: bg-input/30 (gray-700 com opacidade) - para dark mode
  borderColor: "#E4E4E7", // Cor da borda (slate-200 ou zinc-200)
  ringColor: "#3B82F6", // Cor do anel de foco (blue-500)
  destructiveColor: "#EF4444", // Cor para erro (red-500)
  disabledOpacity: 0.5,
};

// Lista estática de produtos disponíveis
type Product = {
  id: string;
  nome: string;
  valor: number;
  points: number;
};
const productsAvailable: Product[] = [
  { id: "000001", nome: "Cupom R$5,00 do iFood", valor: 100, points: 500 },
  {
    id: "000002",
    nome: "GiftCard de R$5,00 PlayStore",
    valor: 500,
    points: 500,
  },
  { id: "000003", nome: "1 mês Spotify", valor: 2400, points: 2400 },
];

export default function CreateReward() {
  const [investment, setInvestment] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    productsAvailable[0]
  );
  const [minInvestment, setMinInvestment] = useState(
    productsAvailable[0].valor
  );
  const [quantity, setQuantity] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isInvalidInvestment, setIsInvalidInvestment] = useState(false);
  const { user, login, addMovimentation } = useAuthStore();
  const { createReward } = useRewardsStore();

  // Calcula a quantidade de recompensas e valida o investimento mínimo
  useEffect(() => {
    if (!investment || !selectedProduct) return;
    console.log("Calculando quantidade e investimento mínimo...");
    const value = parseFloat(investment) || 0;
    const productValue = selectedProduct.valor || 1;
    const calculatedQuantity = Math.floor(value / productValue);
    setQuantity(calculatedQuantity);

    setMinInvestment(selectedProduct.valor);
    console.log("valor investido", value);
    console.log("valor do produto", selectedProduct.valor);
    console.log("é valida o investimento", isInvalidInvestment);
    setIsInvalidInvestment(value < selectedProduct.valor);
  }, [investment, selectedProduct]);

  const handleConfirm = () => {
    if (!investment || !selectedProduct) {
      alert(
        "Por favor, preencha o valor do investimento e selecione um produto."
      );
      return;
    }
    if (isInvalidInvestment) {
      alert(`Investimento mínimo de R$${selectedProduct.valor}`);
      return;
    }
    if (quantity === 0) {
      alert(
        "O valor do investimento é insuficiente para financiar uma recompensa."
      );
      return;
    }
    setModalVisible(true);
  };

  const handlePasswordSubmit = async () => {
    if (!user) {
      alert("Nenhum usuário logado.");
      setModalVisible(false);
      return;
    }

    // Valida a senha
    const isValid = await login(user.email, password);
    if (!isValid) {
      alert("Senha incorreta. Tente novamente.");
      setPassword("");
      return;
    }

    const newReward: Reward = {
      id: uuidv4(),
      nome: selectedProduct.nome,
      valor: selectedProduct.points,
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
      alert(`Recompensa "${selectedProduct.nome}" financiada com sucesso!`);
      setModalVisible(false);
      router.push("/");
    } else {
      alert("Falha ao criar a recompensa.");
      setModalVisible(false);
    }
  };

  return (
    <ScrollView>
      <Container>
        <Text style={styles.label}>Valor do Investimento (R$):</Text>
        <Input
          value={investment}
          onChangeText={setInvestment}
          style={[styles.input, isInvalidInvestment && styles.invalidInput]}
          keyboardType="numeric"
          placeholder="Digite o valor"
        />
        {isInvalidInvestment && (
          <Text style={styles.errorText}>
            Investimento mínimo de R${minInvestment}
          </Text>
        )}
        <Text style={styles.label}>Recompensa:</Text>
        <Picker
          selectedValue={JSON.stringify(selectedProduct)}
          onValueChange={(value) => {
            console.log("Selecionando produto:", value);
            setSelectedProduct(JSON.parse(value));
          }}
          style={styles.picker}
        >
          {productsAvailable.map((product) => (
            <Picker.Item
              key={product.id}
              label={`${product.nome} (R$${product.valor}, ${product.points} pontos)`}
              value={JSON.stringify(product)}
            />
          ))}
        </Picker>
        <Text style={styles.info}>
          Quantidade Financiada: {quantity}{" "}
          {quantity === 1 ? "unidade" : "unidades"}
        </Text>
        <Button onPress={handleConfirm}>Confirmar</Button>
        <Button style={styles.button} onPress={() => router.push("/")}>
          Voltar
        </Button>

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
                <GridDashboard.Actions
                  label="Confirmar"
                  onPress={handlePasswordSubmit}
                />
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 12,
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
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.foreground,
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
