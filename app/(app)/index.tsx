import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function DashScreen() {
  const { user } = useAuthStore(); // depende de como seu store funciona

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (user.tipoUsuario === "colaborador") {
      router.replace("/(app)/(dashboard)/colaborador");
    } else if (user.tipoUsuario === "voluntario") {
      router.replace("/(app)/(dashboard)/voluntario");
    } else if (
      user.tipoUsuario === "parceiro" ||
      user.tipoUsuario === "admin"
    ) {
      router.replace("/(app)/(dashboard)/parceiro");
    }
  }, [user]);

  return (
    <View>
      <Text>Redirecionando...</Text>
    </View>
  );
}
