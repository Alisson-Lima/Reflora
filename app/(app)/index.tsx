/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { useAuthStore } from "@/store/authStore";
import { useMissionsStore } from "@/store/missionsStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { Mission, Reward } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Button,
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

  const handleGetMovements = async () => {
    const mov = await getMovements();
    console.log(mov);
  };

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
    if (movs.length > 0) {
      return movs[movs.length - 1].description;
    } else {
      return "Sem movimentações";
    }
  };

  return (
    <ScrollView>
      <Container>
        <GridDashboard.Root>
          <View style={styles.flex}>
            <GridDashboard.Mission
              title="Missões concluídas"
              description="Desde 08, 2024 até hoje"
              counter="999999999"
            />
            <GridDashboard.Point
              counter="999999999"
              title="Pontos Acumulados"
            />
          </View>
          <GridDashboard.Historic
            title="Histórico de movimentações"
            description="Última movimentação"
            counter={getLastMovement()}
          />
          <View style={styles.actionsContainer}>
            <GridDashboard.Actions
              label="Criar novo brinde"
              onPress={() => router.push("/create/reward")}
            />
            <GridDashboard.Actions
              label="Criar nova missão"
              onPress={() => router.push("/create/mission")}
            />
          </View>
        </GridDashboard.Root>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Recompensas Financiadas:</Text>
        {userRewards.length === 0 ? (
          <Text style={styles.info}>Nenhuma recompensa financiada.</Text>
        ) : (
          <FlatList
            data={userRewards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: Reward }) => (
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
        )}

        <Button
          title="Limpar Storage"
          onPress={async () => {
            await AsyncStorage.clear();
            console.log("AsyncStorage limpo");
          }}
        />
        <Button title="Ver movimentações" onPress={handleGetMovements} />
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
