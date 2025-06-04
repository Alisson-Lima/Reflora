/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import ListActionItem from "@/components/ListActionItem";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Movimentation } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text } from "react-native";

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
            renderItem={({ item }: Readonly<{ item: Movimentation }>) => (
              <ListActionItem
                title={item.type}
                description={item.description}
                onPress={() => {}}
              />
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma movimentação.</Text>
        )}
        <Button onPress={() => router.push("/")}>Voltar</Button>
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
