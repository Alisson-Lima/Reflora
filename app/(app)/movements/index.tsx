/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import { useAuthStore } from "@/store/authStore";
import { Movimentation } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Movements() {
  const { getMovements } = useAuthStore();
  const [movs, setMovs] = useState<Movimentation[]>([]);

  useEffect(() => {
    const fetchMovs = async () => {
      const m = await getMovements();
      console.log(m);
      setMovs(m);
    };
    fetchMovs();
  }, []);

  return (
    <ScrollView>
      <Container>
        <Text>Suas movimentações</Text>
        {Array.isArray(movs) && movs.length > 0 ? (
          <FlatList
            data={movs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: Movimentation }) => (
              <View style={styles.movItem}>
                <Text>Tipo movimentação: {item.type}</Text>
                <Text>Descrição: {item.description}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma movimentação.</Text>
        )}
        <Button onPress={() => router.push("/")} title="Voltar" />
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  info: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
  },
  movItem: {
    width: "100%",
    padding: 16,
  },
});
