import { Reward } from "@/types/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface RewardsState {
  rewards: Reward[];
  loading: boolean;
  init: () => Promise<void>;
  createReward: (reward: Reward) => Promise<boolean>;
  getRewards: () => Promise<Reward[]>;
}

const STORAGE_KEY = "appRewards";

const loadRewardsFromStorage = async (): Promise<Reward[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao carregar rewards do AsyncStorage:", error);
    return [];
  }
};

const saveRewardsToStorage = async (rewards: Reward[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
    return true;
  } catch (error) {
    console.error("Erro ao salvar rewards no AsyncStorage:", error);
    return false;
  }
};

export const useRewardsStore = create<RewardsState>((set) => ({
  rewards: [],
  loading: true,

  init: async () => {
    try {
      const rewards = await loadRewardsFromStorage();
      set({ rewards, loading: false });
    } catch (error) {
      console.error("Erro ao inicializar rewards store:", error);
      set({ loading: false });
    }
  },

  createReward: async (newReward: Reward) => {
    try {
      const rewards = await loadRewardsFromStorage();
      const updatedRewards = [...rewards, newReward];
      const saved = await saveRewardsToStorage(updatedRewards);
      if (saved) {
        set({ rewards: updatedRewards });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar reward:", error);
      return false;
    }
  },

  getRewards: async () => {
    return await loadRewardsFromStorage();
  },
  clearAll: async () => {
    try {
      const clear = await saveRewardsToStorage([]);
      if (clear) {
        set({ rewards: [] });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar reward:", error);
      return false;
    }
  },
}));
