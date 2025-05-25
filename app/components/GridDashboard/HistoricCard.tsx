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
  iconColor = "blue",
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
    width: "100%",
    borderWidth: 1,
    height: 130,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    rowGap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#747474",
    fontWeight: "500",
  },
  counter: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
