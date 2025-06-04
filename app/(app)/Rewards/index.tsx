import Container from "@/components/Container";
import { useAuthStore } from "@/store/authStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { Movimentation, Reward } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

export default function Rewards() {
  const { user, removeUserPoints, addMovimentation } = useAuthStore();
  const [refetchStates, setRefetchStates] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const { getRewards, init, updateReward } = useRewardsStore();
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
    }
  }, [user]);

  async function initUserData() {
    if (!user) return;
    init();
    setUserPoints(user.points);
    const rewardsList = await getRewards();
    setRewards(rewardsList);
  }

  useEffect(() => {
    initUserData();
  }, []);

  useEffect(() => {
    initUserData();
  }, [refetchStates]);

  const handleGetReward = async (reward: Reward) => {
    if (userPoints >= reward.valor && reward.unidadesRestantes > 0) {
      await removeUserPoints(reward.valor);

      const updatedReward: Reward = {
        ...reward,
        unidadesRestantes: reward.unidadesRestantes - 1,
      };
      await updateReward(updatedReward);

      const newMovimentation: Movimentation = {
        id: uuidv4(),
        type: "redeem-reward",
        description: `Resgatou a recompensa ${reward.nome} por ${reward.valor} pontos.`,
      };
      addMovimentation(newMovimentation);
      setRefetchStates(!refetchStates);
      alert("Recompensa resgatada com sucesso!");
    } else {
      alert("Pontos insuficientes para resgatar esta recompensa.");
    }
  };

  return (
    <ScrollView>
      <Container>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Pontos Acomulados</Text>
          </View>
          <View style={styles.actions}>
            <Text style={styles.counter}>{userPoints}</Text>
          </View>
        </View>
        <Text>Recompensas disponíveis</Text>

        {/* list rewards */}
        {rewards.map((reward) => {
          return (
            reward.unidadesRestantes > 0 && (
              <View key={reward.id} style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.title}>{reward.nome}</Text>
                  <Text style={styles.description}>
                    Unidades restantes: {reward.unidadesRestantes}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Text style={styles.counter}>{reward.valor} pontos</Text>
                  <Button
                    title="Resgatar"
                    onPress={() => {
                      handleGetReward(reward);
                    }}
                  />
                </View>
              </View>
            )
          );
        })}

        <Button onPress={() => router.push("/")} title="Voltar" />
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    height: 130,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    rowGap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#747474",
    fontWeight: "500",
  },
  counter: {
    fontWeight: "bold",
    fontSize: 32,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
