/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import ListActionItem from "@/components/ListActionItem";
import { Button } from "@/components/ui/button";
import UserHeader from "@/components/UserHeader";
import { useAuthStore } from "@/store/authStore";
import { useMissionsStore } from "@/store/missionsStore";
import { Mission, Movimentation, UserMission } from "@/types";
import { format } from "date-fns";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";

export default function DashScreen() {
  const {
    user,
    logout,
    getMovements,
    getUserMissions,
    updateUserMission,
    setUserMission,
    addMovimentation,
    addUserPoints,
  } = useAuthStore();
  const { missions, init: initMissions } = useMissionsStore();
  const [pendingMissions, setPendingMissions] = useState<UserMission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<UserMission[]>([]);
  const [userMoviments, setUserMoviments] = useState<Movimentation[]>([]);
  const [refetchStates, setRefetchStates] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [codeValue, setCodeValue] = useState("");
  const [selectedUserMission, setSelectedUserMission] =
    useState<UserMission | null>(null);
  const [openFinishMissionModal, setOpenFinishMissionModal] = useState(false);

  const [openGetMissionModal, setOpenGetMissionModal] = useState(false);

  const appMissions = missions;

  async function initUserData() {
    initMissions();
    const userMissions = await getUserMissions();
    setPendingMissions(userMissions.filter((m) => m.status == "pending") || []);
    setCompletedMissions(
      userMissions.filter((m) => m.status == "completed") || []
    );

    const movs = await getMovements();
    setUserMoviments(movs);
  }

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
    }
  }, [user]);

  useEffect(() => {
    initUserData();
  }, []);

  useEffect(() => {
    initUserData();
  }, [refetchStates]);

  if (!user) {
    return (
      <View>
        <Text style={{ fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  async function handleAcceptMission(mission: Mission) {
    if (!mission || !user) {
      return;
    }

    const newMission: UserMission = {
      ...mission,
      id: uuidv4(),
      status: "pending",
    };

    await setUserMission(newMission);

    const newMovimentation: Movimentation = {
      id: uuidv4(),
      type: "redeem-mission",
      description: `Resgatou a missão "${mission.nome}" com ${mission.points} pontos`,
    };
    await addMovimentation(newMovimentation);

    setCodeValue("");
    setRefetchStates(!refetchStates);
    setOpenGetMissionModal(false);
  }

  async function handleFinishUserMission(mission: UserMission) {
    if (!mission || !user) {
      return;
    }

    const updatedMission: UserMission = {
      ...mission,
      status: "completed",
    };

    await updateUserMission(updatedMission);

    await addUserPoints(mission.points);

    const newMovimentation: Movimentation = {
      id: uuidv4(),
      type: "complete-mission",
      description: `Concluiu a missão "${mission.nome}" com ${mission.points} pontos`,
    };
    await addMovimentation(newMovimentation);

    setRefetchStates(!refetchStates);
    setOpenFinishMissionModal(false);
    alert("Missão concluída com sucesso!");
  }

  return (
    <ScrollView>
      <Container>
        <UserHeader userName={user.nome} userType={user.tipoUsuario} />
        <GridDashboard.Root>
          <View style={styles.flex}>
            <GridDashboard.Mission
              title="Missões Concluídas"
              description={`Desde ${format(
                new Date(user.createdAt),
                "dd/MM/yyyy"
              )} até hoje`}
              counter={completedMissions.length.toString() || "0"}
            />
            <GridDashboard.Point
              title="Pontos resgatados"
              counter={user.points.toString()}
            />
          </View>
          <GridDashboard.Historic
            title="Histórico de movimentações"
            description="Última movimentação"
            counter={
              userMoviments[userMoviments.length - 1]?.description ||
              "Sem movimentações"
            }
            onPress={() => router.push("/movements")}
          />
        </GridDashboard.Root>
        <Button onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Button>

        <Text style={styles.sectionTitle}>Missões Pendentes:</Text>
        {Array.isArray(pendingMissions) && pendingMissions.length > 0 ? (
          <FlatList
            data={pendingMissions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: Readonly<{ item: UserMission }>) => (
              <ListActionItem
                title={item.nome}
                description={item.descricao}
                onPress={() => {
                  setSelectedUserMission(item);
                  setOpenFinishMissionModal(true);
                }}
                hasPoints={true}
                points={item.points}
              />
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
            renderItem={({ item }: Readonly<{ item: Mission }>) => (
              <ListActionItem
                title={item.nome}
                description={item.descricao}
                onPress={() => {
                  setSelectedMission(item);
                  setOpenGetMissionModal(true);
                }}
                hasPoints={true}
                points={item.points}
              />
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma missão disponível.</Text>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={openGetMissionModal}
          onRequestClose={() => setOpenGetMissionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                Detalhes da missão
              </Text>
              <Text style={styles.rewardText}>
                Nome: {selectedMission?.nome}
              </Text>
              <Text style={styles.rewardText}>
                Descrição: {selectedMission?.descricao}
              </Text>
              <Text style={styles.rewardText}>
                Local de Entrega: {selectedMission?.local}
              </Text>
              <Text style={styles.rewardText}>
                Pontos: {selectedMission?.points}
              </Text>
              <Pressable
                onPress={() => {
                  if (selectedMission) {
                    handleAcceptMission(selectedMission);
                  }
                  setOpenGetMissionModal(false);
                }}
                style={{
                  marginTop: 16,
                  backgroundColor: "#28a745",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Aceitar Missão
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setOpenGetMissionModal(false);
                  setSelectedMission(null);
                }}
                style={{
                  marginTop: 8,
                  backgroundColor: "#dc3545",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Fechar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openFinishMissionModal}
          onRequestClose={() => setOpenFinishMissionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                Detalhes da missão
              </Text>
              <Text style={styles.rewardText}>
                Nome: {selectedUserMission?.nome}
              </Text>
              <Text style={styles.rewardText}>
                Descrição: {selectedUserMission?.descricao}
              </Text>
              <Text style={styles.rewardText}>
                Local de Entrega: {selectedUserMission?.local}
              </Text>
              <Text style={styles.rewardText}>
                Pontos: {selectedUserMission?.points}
              </Text>
              <TextInput
                style={styles.input}
                value={codeValue}
                onChange={(e) => setCodeValue(e.nativeEvent.text)}
                placeholder="Código Verificador"
              />
              <Pressable
                onPress={() => {
                  if (codeValue === selectedUserMission?.codigoVerificador) {
                    handleFinishUserMission(selectedUserMission);
                  } else {
                    alert("Código verificador incorreto!");
                  }
                }}
                style={{
                  marginTop: 16,
                  backgroundColor: "#28a745",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Finalizar Missão
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedMission(null);
                  setOpenFinishMissionModal(false);
                }}
                style={{
                  marginTop: 8,
                  backgroundColor: "#dc3545",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Fechar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    backgroundColor: "#dc3545",
    marginTop: 16,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  Text: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    opacity: 0.7,
    marginBottom: 16,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 4,
    fontSize: 16,
    color: "#333",
  },
});
