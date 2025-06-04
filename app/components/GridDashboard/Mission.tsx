import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface MissionsProps {
  title?: string;
  description?: string;
  counter?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  counterStyle?: TextStyle;
}

export default function Missions({
  title,
  description,
  counter,
  style,
  titleStyle,
  descriptionStyle,
  counterStyle,
}: MissionsProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      </View>
      <Text style={[styles.counter, counterStyle]}>{counter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: "space-between",
    padding: 16,
    
    height: 130,
    backgroundColor: "#fff",
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
    fontSize: 24,
    fontWeight: "700",
    color: "#34495e",
    textAlign: "right",
  },
});
