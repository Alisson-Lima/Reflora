import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface RootProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function Root({ children, style }: RootProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    rowGap: 16,
    gap: 16,
  },
});
