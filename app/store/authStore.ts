import { Job, Mission, Movimentation, User } from "@/types/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

// Tipo do estado + ações
interface AuthState {
  user: User | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (newUser: User) => Promise<boolean>;
  getUsers: () => Promise<User[]>;
  addMovimentation: (movement: Omit<Movimentation, "id">) => Promise<boolean>;
  getMovements: () => Promise<Movimentation[]>;
  getUserMissions: () => Promise<Mission[]>;
  getUserJobs: () => Promise<Job[]>;
  setUserJob: (job: Job) => Promise<void>;
  updateUserJob: (job: Job) => Promise<void>;
  addUserPoints: (points: number) => Promise<void>;
  removeUserPoints: (points: number) => Promise<void>;
}

// Chave para armazenar usuários no AsyncStorage
const STORAGE_KEY = "users";

// Usuário administrador padrão
const adminUser: User = {
  createdAt: "2025-05-01T00:00:00Z",
  points: 0,
  cpf: "0000000000000",
  email: "admin@admin.com",
  id: "1234",
  nome: "Admin <3",
  senha: "@admin123",
  tipoUsuario: "admin",
  movimentations: [],
};

// Funções auxiliares para manipular o AsyncStorage
const loadUsersFromStorage = async (): Promise<User[]> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erro ao carregar usuários do AsyncStorage:", error);
    return [];
  }
};

const saveUsersToStorage = async (users: User[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error("Erro ao salvar usuários no AsyncStorage:", error);
    return false;
  }
};

const loadCurrentUserFromStorage = async (): Promise<User | null> => {
  try {
    const saved = await AsyncStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Erro ao carregar usuário atual do AsyncStorage:", error);
    return null;
  }
};

const saveCurrentUserToStorage = async (
  user: User | null
): Promise<boolean> => {
  try {
    if (user) {
      await AsyncStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("currentUser");
    }
    return true;
  } catch (error) {
    console.error("Erro ao salvar usuário atual no AsyncStorage:", error);
    return false;
  }
};

// Criando a loja com Zustand
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      let users = await loadUsersFromStorage();

      // Verifica se o usuário admin já existe (por email ou id)
      const adminExists = users.some(
        (user) => user.email === adminUser.email || user.id === adminUser.id
      );

      // Se o admin não existe, adiciona-o
      if (!adminExists) {
        users = [...users, adminUser];
        await saveUsersToStorage(users);
      }

      // Carrega o usuário atual (se houver)
      const currentUser = await loadCurrentUserFromStorage();
      set({ user: currentUser, loading: false });
    } catch (error) {
      console.error("Erro ao inicializar store:", error);
      set({ loading: false });
    }
  },

  login: async (email, senha) => {
    try {
      const users = await loadUsersFromStorage();
      const foundUser = users.find(
        (user) => user.email === email && user.senha === senha
      );
      if (foundUser) {
        await saveCurrentUserToStorage(foundUser);
        set({ user: foundUser });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao logar:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      await saveCurrentUserToStorage(null);
      set({ user: null });
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  },

  register: async (newUser) => {
    try {
      const users = await loadUsersFromStorage();
      if (users.some((user) => user.email === newUser.email)) {
        console.error("Usuário com este email já existe");
        return false;
      }
      // Inicializa movements como array vazio
      const userWithMovements = { ...newUser, movements: [] };
      const updatedUsers = [...users, userWithMovements];
      const saved = await saveUsersToStorage(updatedUsers);
      if (saved) {
        await saveCurrentUserToStorage(userWithMovements);
        set({ user: userWithMovements });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return false;
    }
  },

  getUsers: async () => {
    return await loadUsersFromStorage();
  },

  addMovimentation: async (movement) => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return false;
      }

      const users = await loadUsersFromStorage();
      const newMovement: Movimentation = {
        id: uuidv4(),
        type: movement.type,
        description: movement.description,
      };

      const updatedUser: User = {
        ...currentUser,
        movimentations: [...currentUser.movimentations, newMovement],
      };

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      const savedUsers = await saveUsersToStorage(updatedUsers);
      const savedCurrentUser = await saveCurrentUserToStorage(updatedUser);

      if (savedUsers && savedCurrentUser) {
        set({ user: updatedUser });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao adicionar movimentação:", error);
      return false;
    }
  },

  getMovements: async () => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      return currentUser ? currentUser.movimentations : [];
    } catch (error) {
      console.error("Erro ao recuperar movimentações:", error);
      return [];
    }
  },

  getUserMissions: async () => {
    // Futuramente, retornará user.missions quando implementado
    return [];
  },

  getUserJobs: async () => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      return currentUser ? currentUser.jobs || [] : [];
    } catch (error) {
      console.error("Erro ao recuperar jobs do usuário:", error);
      return [];
    }
  },
  setUserJob: async (job) => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return;
      }

      const users = await loadUsersFromStorage();

      const userJobs = currentUser.jobs || [];
      const newUserJobs = [...userJobs, job];

      const updatedUser: User = {
        ...currentUser,
        jobs: newUserJobs,
      };

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      const savedUsers = await saveUsersToStorage(updatedUsers);
      const savedCurrentUser = await saveCurrentUserToStorage(updatedUser);

      if (savedUsers && savedCurrentUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error("Erro ao atualizar job do usuário:", error);
    }
  },
  updateUserJob: async (job) => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return;
      }

      const users = await loadUsersFromStorage();

      const updatedJobs =
        currentUser.jobs?.map((j) => (j.id === job.id ? job : j)) || [];

      const updatedUser: User = {
        ...currentUser,
        jobs: updatedJobs,
      };

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      const savedUsers = await saveUsersToStorage(updatedUsers);
      const savedCurrentUser = await saveCurrentUserToStorage(updatedUser);

      if (savedUsers && savedCurrentUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error("Erro ao atualizar job do usuário:", error);
    }
  },
  addUserPoints: async (points) => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return;
      }

      const users = await loadUsersFromStorage();

      const updatedUser: User = {
        ...currentUser,
        points: (currentUser.points || 0) + points,
      };

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      const savedUsers = await saveUsersToStorage(updatedUsers);
      const savedCurrentUser = await saveCurrentUserToStorage(updatedUser);

      if (savedUsers && savedCurrentUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error("Erro ao adicionar pontos ao usuário:", error);
    }
  },
  removeUserPoints: async (points) => {
    try {
      const currentUser = await loadCurrentUserFromStorage();
      if (!currentUser) {
        console.error("Nenhum usuário logado");
        return;
      }

      const users = await loadUsersFromStorage();

      const updatedUser: User = {
        ...currentUser,
        points: Math.max((currentUser.points || 0) - points, 0), // Garante que os pontos não fiquem negativos
      };

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      const savedUsers = await saveUsersToStorage(updatedUsers);
      const savedCurrentUser = await saveCurrentUserToStorage(updatedUser);

      if (savedUsers && savedCurrentUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error("Erro ao remover pontos do usuário:", error);
    }
  },
}));
