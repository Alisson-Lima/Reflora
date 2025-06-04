import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function Container({
  children,
  style,
}: Readonly<{
  children?: ReactNode;
  style?: ViewStyle;
}>) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
