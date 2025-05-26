/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { useAuthStore } from "@/store/authStore";
import { useMissionsStore } from "@/store/missionsStore";
import { Mission } from "@/types";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DashScreen() {
  const { user, logout, getMovements } = useAuthStore();
  const { missions, init: initMissions } = useMissionsStore();

  const appMissions = missions;

  const pendingMissions: Mission[] = [
    {
      descricao: "testeee",
      id: "123123",
      idParceiro: "234234",
      localEntrega: "testeee",
      nome: "resgatar asdaf",
      valorReward: 10000,
    },
  ];

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
    }
  }, [user]);

  useEffect(() => {
    initMissions();
  }, []);

  if (!user) {
    return (
      <View>
        <Text style={{ fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  const getLastMovement = async () => {
    const movs = await getMovements();
    if (Array.isArray(movs) && movs.length > 0) {
      return movs[movs.length - 1].description;
    } else {
      return "Sem movimentações";
    }
  };

  return (
    <ScrollView>
      <Container>
        <Text>Colaborador</Text>
        <GridDashboard.Root>
          <View style={styles.flex}>
            <GridDashboard.Mission
              title="Missões Concluídas"
              description="Desde 08, 2024 até hoje"
              counter="9999"
            />
            <GridDashboard.Point title="Pontos resgatados" counter="9999" />
          </View>
          <GridDashboard.Historic
            title="Histórico de movimentações"
            description="Última movimentação"
            counter={getLastMovement()}
            onPress={() => router.push("/movements")}
          />
        </GridDashboard.Root>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Missões Pendentes:</Text>
        {Array.isArray(pendingMissions) && pendingMissions.length > 0 ? (
          <FlatList
            data={pendingMissions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: Mission }) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Missão: {item.nome}</Text>
                <Text style={styles.rewardText}>
                  Descrição: {item.descricao}
                </Text>
                <Text style={styles.rewardText}>
                  Local: {item.localEntrega}
                </Text>
                <Text style={styles.rewardText}>
                  Pontos: {item.valorReward}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma missão pendente.</Text>
        )}

        <Text style={styles.sectionTitle}>Missões Disponiveis:</Text>
        {Array.isArray(appMissions) && appMissions.length > 0 ? (
          <FlatList
            data={appMissions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: Mission }) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Missão: {item.nome}</Text>
                <Text style={styles.rewardText}>
                  Descrição: {item.descricao}
                </Text>
                <Text style={styles.rewardText}>
                  Local: {item.localEntrega}
                </Text>
                <Text style={styles.rewardText}>
                  Pontos: {item.valorReward}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma missão disponível.</Text>
        )}
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  actionsContainer: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
    marginTop: 16,
  },
  logoutButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ff1919",
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  rewardItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 16,
    color: "#333",
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
});
