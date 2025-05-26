import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

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
    <View style={[styles.container, style]}>
      <View style={styles.coin} />
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.counter, counterStyle]}>{counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    height: 130,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    color: "#747474",
    fontWeight: "500",
  },
  counter: {
    fontSize: 16,
    fontWeight: "700",
  },
  coin: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#eee",
  },
});
