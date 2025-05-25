import { Mission } from "@/types/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface MissionsState {
  missions: Mission[];
  loading: boolean;
  init: () => Promise<void>;
  createMission: (mission: Mission) => Promise<boolean>;
  getAllAppMissions: () => Promise<Mission[]>;
}

const STORAGE_KEY = "appMissions";

const loadMissionsFromStorage = async (): Promise<Mission[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao carregar missões do AsyncStorage:", error);
    return [];
  }
};

const saveMissionsToStorage = async (missions: Mission[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
    return true;
  } catch (error) {
    console.error("Erro ao salvar missões no AsyncStorage:", error);
    return false;
  }
};

export const useMissionsStore = create<MissionsState>((set) => ({
  missions: [],
  loading: true,

  init: async () => {
    try {
      const missions = await loadMissionsFromStorage();
      set({ missions, loading: false });
    } catch (error) {
      console.error("Erro ao inicializar missions store:", error);
      set({ loading: false });
    }
  },

  createMission: async (newMission: Mission) => {
    try {
      const missions = await loadMissionsFromStorage();
      const updatedMissions = [...missions, newMission];
      const saved = await saveMissionsToStorage(updatedMissions);
      if (saved) {
        set({ missions: updatedMissions });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar missão:", error);
      return false;
    }
  },

  getAllAppMissions: async () => {
    return await loadMissionsFromStorage();
  },
}));
