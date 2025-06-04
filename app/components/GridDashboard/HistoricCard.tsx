import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface HistoricProps {
  title?: string;
  description?: string;
  counter?: string | Promise<string>;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  counterStyle?: TextStyle;
  onPress?: () => void;
  iconColor?: string;
}

export default function Historic({
  title,
  description,
  counter,
  style,
  titleStyle,
  descriptionStyle,
  counterStyle,
  onPress,
  iconColor = "#2c3e50",
}: HistoricProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      </View>
      <View style={styles.actions}>
        <Text style={[styles.counter, counterStyle]}>{counter}</Text>
        <TouchableOpacity onPress={onPress}>
          <Feather name="chevron-right" size={32} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    height: 130,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#7f8c8d",
  },
  counter: {
    fontSize: 16  ,
    fontWeight: "700",
    color: "#34495e",
    textAlign: "right",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

