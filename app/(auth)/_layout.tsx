// app/(auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function AuthLayout() {
  const { user, loading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) return null;

  if (user) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
