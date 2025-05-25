import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ActionsProps {
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Actions({
  label,
  onPress,
  style,
  textStyle,
}: ActionsProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.button, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    color: "white",
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
});
