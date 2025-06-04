/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import { useAuthStore } from "@/store/authStore";
import { Movimentation } from "@/types";
import GridDashboard from "@/components/GridDashboard";
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
        <Text style={styles.sectionTitle}>Suas movimentações</Text>
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


                    <GridDashboard.Actions
              label="Voltar"
              onPress={() => router.push("/")}
            />
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  info: {
    fontSize: 16,
    color: "#000",
    marginBottom: 16,
  },
  movItem: {
    width: "100%",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },


});
