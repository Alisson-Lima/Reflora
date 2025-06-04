import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function Container({ children }: { children?: ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 700,
    minWidth:500,
  
    marginHorizontal: "auto",
    marginVertical: 30,
    backgroundColor: "#DBDBDB",
    minHeight: "100%",

    
    borderRadius: 16,
    
  },
});
