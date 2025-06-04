import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../ui/button";

type Props = {
  onPress: () => void;
  text: string;
  buttonText: string;
  iconName: typeof Feather.prototype.name;
};

export default function ChoseLoginButton({
  onPress,
  text,
  buttonText,
  iconName,
}: Readonly<Props>) {
  return (
    <View style={styles.card}>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#f0f0f0",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          boxSizing: "border-box",
          borderRadius: 4,
        }}
      >
        <Feather name={iconName} size={24} />
      </View>
      <Text style={{ fontSize: 18, fontWeight: "500" }}>{text}</Text>
      <Button onPress={onPress} style={{ borderRadius: 8 }}>
        {buttonText}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
});
