import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface PointsProps {
  title?: string;
  counter?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  counterStyle?: TextStyle;
}

export default function Points({
  title,
  counter,
  style,
  titleStyle,
  counterStyle,
}: PointsProps) {
  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => {
        router.push("/Rewards");
      }}
    >
      <View style={styles.coin} />
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.counter, counterStyle]}>{counter}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    height: 130,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  coin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fcd34d", // amarelo suave (ouro)
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  counter: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "right",
  },
});

