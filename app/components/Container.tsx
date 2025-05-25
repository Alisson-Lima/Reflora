import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function Container({ children }: { children?: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderColor: "#f72e2e",
    borderWidth: 1,
    backgroundColor: "#ececec",
  },
});
