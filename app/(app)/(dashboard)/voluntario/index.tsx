/* eslint-disable react-hooks/exhaustive-deps */
import Container from "@/components/Container";
import GridDashboard from "@/components/GridDashboard";
import { CollectAreas } from "@/mocks/CollectAreas";
import { useAuthStore } from "@/store/authStore";
import { CollectAreaType, Job, Movimentation } from "@/types";
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
import { v4 } from "uuid";

export default function DashScreen() {
  const {
    user,
    logout,
    getMovements,
    setUserJob,
    getUserJobs,
    addMovimentation,
    updateUserJob,
    addUserPoints,
  } = useAuthStore();
  const [areaSelected, setAreaSelected] = useState<CollectAreaType | null>(
    null
  );
  const [refetchStates, setRefetchStates] = useState(false);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [userMoviments, setUserMoviments] = useState<Movimentation[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFinishJob, setOpenModalFinishJob] = useState(false);
  const [finishJobSelected, setFinishJobSelected] = useState<Job | null>(null);
  const [jobDate, setJobDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const appJobs = CollectAreas;

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
    }
    console.log("User data:", user);
  }, [user]);

  async function initUserData() {
    const userJobs = await getUserJobs();
    setPendingJobs(userJobs.filter((job) => job.status == "pending") || []);
    setCompletedJobs(userJobs.filter((job) => job.status == "completed") || []);

    const movs = await getMovements();
    setUserMoviments(movs);
  }

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

  const handleOpenDetailsCollectArea = (collectArea: CollectAreaType) => {
    setAreaSelected(collectArea);
    setOpenModal(true);
  };

  const handleGetJobs = async (collectArea: CollectAreaType | null) => {
    setOpenModal(false);
    setJobDate("");
    setDateError("");
    if (!collectArea) return;

    // Validar data
    if (jobDate.length !== 10) {
      console.log("Data inválida");
      return;
    }
    const [day, month, year] = jobDate.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(inputDate.getTime()) || inputDate < today) {
      console.log("Data anterior a hoje ou inválida");
      return;
    }

    const newJob: Job = {
      id: v4(),
      nome: collectArea.nome,
      descricao: collectArea.descricao ?? "Nenhuma descrição disponível",
      dataJob: jobDate, // Armazena como dd/mm/aaaa
      local: collectArea.local,
      points: collectArea.points,
      codigoVerificador: collectArea.codigoVerificador,
      status: "pending",
    };
    console.log("New Job Created:", newJob);
    await setUserJob(newJob);
    console.log("Updated User Jobs:", user.jobs);

    const newMov: Movimentation = {
      id: v4(),
      type: "schedule-work",
      description: `Trabalho agendado na área de coleta "${collectArea.nome}" com ${collectArea.points} pontos em ${jobDate}`,
    };
    await addMovimentation(newMov);

    setRefetchStates(!refetchStates);
  };

  const handleFinishJob = async (job: Job | null) => {
    if (!job) return;
    const updatedJob: Job = {
      ...job,
      status: "completed",
    };
    await updateUserJob(updatedJob);
    await addUserPoints(job.points);

    const newMov: Movimentation = {
      id: v4(),
      type: "complete-work",
      description: `Trabalho concluído na área de coleta "${job.nome}" com ${job.points} pontos em ${job.dataJob}`,
    };
    await addMovimentation(newMov);

    setRefetchStates(!refetchStates);
    setOpenModalFinishJob(false);
  };

  return (
    <ScrollView>
      <Container>
        <Text>Voluntario</Text>
        <GridDashboard.Root>
          <View style={styles.flex}>
            <GridDashboard.Mission
              title="Trabalho concluídos"
              description={`Desde ${format(
                new Date(user.createdAt),
                "dd/MM/yyyy"
              )} até hoje`}
              counter={completedJobs.length.toString()}
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
              userMoviments[userMoviments.length - 1]?.description ??
              "Nenhuma movimentação"
            }
            onPress={() => router.push("/movements")}
          />
        </GridDashboard.Root>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Trabalho agendado:</Text>
        {Array.isArray(pendingJobs) && pendingJobs.length > 0 ? (
          <FlatList
            data={pendingJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: Readonly<{ item: Job }>) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Missão: {item.nome}</Text>
                <Text style={styles.rewardText}>
                  Descrição: {item.descricao}
                </Text>
                <Text style={styles.rewardText}>Local: {item.local}</Text>
                <Text style={styles.rewardText}>Pontos: {item.points}</Text>
                <Text style={styles.rewardText}>
                  Data agendada: {item.dataJob}
                </Text>
                <Pressable
                  style={{
                    marginTop: 8,
                    backgroundColor: "#007bff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                  onPress={() => {
                    setFinishJobSelected(item);
                    setOpenModalFinishJob(true);
                  }}
                >
                  <Text>Ver Detalhes</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhum trabalho agendado.</Text>
        )}

        <Text style={styles.sectionTitle}>Areas de coleta disponiveis:</Text>
        {Array.isArray(appJobs) && appJobs.length > 0 ? (
          <FlatList
            data={appJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: Readonly<{ item: CollectAreaType }>) => (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardText}>Nome: {item.nome}</Text>
                <Text style={styles.rewardText}>
                  Descrição: {item.descricao}
                </Text>
                <Text style={styles.rewardText}>Local: {item.local}</Text>
                <Text style={styles.rewardText}>Pontos: {item.points}</Text>
                <Pressable
                  onPress={() => handleOpenDetailsCollectArea(item)}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#007bff",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text>Trabalhar</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text style={styles.info}>Nenhuma Area de coleta disponível.</Text>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          onRequestClose={() => setOpenModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                Detalhes da Área de Coleta
              </Text>
              <Text style={styles.rewardText}>Nome: {areaSelected?.nome}</Text>
              <Text style={styles.rewardText}>
                Descrição: {areaSelected?.descricao}
              </Text>
              <Text style={styles.rewardText}>
                Local: {areaSelected?.local}
              </Text>
              <Text style={styles.rewardText}>
                Pontos: {areaSelected?.points}
              </Text>
              <Text style={styles.rewardText}>
                Data do Trabalho (dd/mm/aaaa):
              </Text>
              <TextInput
                style={[styles.input, dateError && styles.inputError]}
                value={jobDate}
                onChangeText={(text) => {
                  // Máscara para dd/mm/aaaa
                  let cleaned = text.replace(/\D/g, "");
                  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);
                  let formatted = "";
                  if (cleaned.length > 0) formatted = cleaned.slice(0, 2);
                  if (cleaned.length > 2)
                    formatted += "/" + cleaned.slice(2, 4);
                  if (cleaned.length > 4)
                    formatted += "/" + cleaned.slice(4, 8);
                  setJobDate(formatted);

                  // Validação da data
                  if (formatted.length === 10) {
                    const [day, month, year] = formatted.split("/").map(Number);
                    const inputDate = new Date(year, month - 1, day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (
                      isNaN(inputDate.getTime()) ||
                      inputDate < today ||
                      day < 1 ||
                      day > 31 ||
                      month < 1 ||
                      month > 12 ||
                      year < today.getFullYear()
                    ) {
                      setDateError("Data inválida ou anterior a hoje");
                    } else {
                      setDateError("");
                    }
                  } else {
                    setDateError("");
                  }
                }}
                placeholder="dd/mm/aaaa"
                keyboardType="numeric"
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}
              <Pressable
                onPress={() => {
                  handleGetJobs(areaSelected);
                }}
                style={{
                  marginTop: 20,
                  backgroundColor: "#007bff",
                  padding: 10,
                  borderRadius: 4,
                }}
                disabled={!!dateError || jobDate.length !== 10}
              >
                <Text style={{ color: "white" }}>Trabalhar Neste ponto</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAreaSelected(null);
                  setOpenModal(false);
                  setJobDate("");
                  setDateError("");
                }}
                style={{
                  marginTop: 20,
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white" }}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModalFinishJob}
          onRequestClose={() => setOpenModalFinishJob(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                Detalhes do Trabalho Agendado
              </Text>
              <Text style={styles.rewardText}>
                Nome: {finishJobSelected?.nome}
              </Text>
              <Text style={styles.rewardText}>
                codigo: {finishJobSelected?.codigoVerificador}
              </Text>
              <Text style={styles.rewardText}>
                Descrição: {finishJobSelected?.descricao}
              </Text>
              <Text style={styles.rewardText}>
                Local: {finishJobSelected?.local}
              </Text>
              <Text style={styles.rewardText}>
                Pontos: {finishJobSelected?.points}
              </Text>
              <Text style={styles.rewardText}>
                Data do Trabalho {finishJobSelected?.dataJob}:
              </Text>
              {/* input do código validador do job */}
              <TextInput
                style={styles.input}
                value={codeValue}
                onChange={(e) => setCodeValue(e.nativeEvent.text)}
                placeholder="Código Verificador"
              />

              <Pressable
                onPress={() => {
                  if (codeValue !== finishJobSelected?.codigoVerificador) {
                    alert("Código verificador inválido!");
                    return;
                  }
                  handleFinishJob(finishJobSelected);
                }}
                style={{
                  marginTop: 20,
                  backgroundColor: "#007bff",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white" }}>Finalizar Trabalho</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFinishJobSelected(null);
                  setOpenModalFinishJob(false);
                  setCodeValue("");
                }}
                style={{
                  marginTop: 20,
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "white" }}>Fechar</Text>
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
});
