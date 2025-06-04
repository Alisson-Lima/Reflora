/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useMissionsStore } from "@/store/missionsStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { Mission, Reward } from "@/types";
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
  const { rewards, init: initRewards } = useRewardsStore();
  const { missions, init: initMissions } = useMissionsStore();

  const userRewards = rewards.filter(
    (reward) => reward.idParceiro === user?.id
  );
  const userMissions = missions.filter(
    (mission) => mission.idParceiro === user?.id
  );

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
    }
  }, [user]);

  useEffect(() => {
    initRewards();
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
        <Text style={styles.sectionTitle}>Parceiro</Text>
        <GridDashboard.Root>
          <View style={styles.flex}>
            <GridDashboard.Mission
              title="Missões Criadas"
              description="Desde 08, 2024 até hoje"
              counter={
                Array.isArray(userMissions) ? String(userMissions.length) : ""
              }
            />
            <GridDashboard.Mission
              title="Recompensas Criadas"
              description="Desde 08, 2024 até hoje"
              counter={
                Array.isArray(userRewards) ? String(userRewards.length) : ""
              }
            />
          </View>
          <GridDashboard.Historic

            title="Histórico de movimentações"
            description="Última movimentação"
            counter={getLastMovement()}
            onPress={() => router.push("/movements")}
          />
          <View style={styles.actionsContainer}>
            <Button
              onPress={() => router.push("/create/reward")}
            >Criar novo brinde</Button>
            <Button
              onPress={() => router.push("/create/mission")}
            >Criar nova missão</Button>
          </View>
        </GridDashboard.Root>
        

        <Text style={styles.sectionTitle}>Recompensas Financiadas:</Text>
        {userRewards.length === 0 ? (
          <Text style={styles.info}>Nenhuma recompensa financiada.</Text>
        ) : (
          <FlatList
            data={userRewards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: Readonly<{ item: Reward }>) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Recompensa: {item.nome}</Text>
                <Text style={styles.rewardText}>Pontos: {item.valor}</Text>
                <Text style={styles.rewardText}>
                  Unidades Restantes: {item.unidadesRestantes}
                </Text>
              </View>
            )}
          />
        )}

        <Text style={styles.sectionTitle}>Missões Criadas:</Text>
        {userMissions.length === 0 ? (
          <Text style={styles.info}>Nenhuma missão criada.</Text>
        ) : (
          <FlatList
            data={userMissions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: Readonly<{ item: Mission }>) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Missão: {item.nome}</Text>
                <Text style={styles.rewardText}>
                  Descrição: {item.descricao}
                </Text>
                <Text style={styles.rewardText}>Local: {item.local}</Text>
                <Text style={styles.rewardText}>Pontos: {item.points}</Text>
              </View>
            )}
          />
        )}
        <Button onPress={logout} style={styles.logoutButton}>Sair</Button>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
  flex: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "center",
    marginBottom: 16,
  },
  Container:{
    maxWidth: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 16,
    display: "flex",
    alignItems: "center", 
    justifyContent: "space-around",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 24,
    marginBottom: 12,
  },
  rewardItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  rewardText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: "#000",
    marginBottom: 16,
  },
});

