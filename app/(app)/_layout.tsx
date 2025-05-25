// app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function AppLayout() {
  const { user, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) return null;

  if (!user) {
    return <Redirect href={{ pathname: "/welcome" }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
