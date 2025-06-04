import { Pressable, StyleSheet, Text, View } from "react-native";

type ListActionItemProps = {
  title: string;
  description: string;
  onPress: () => void;
  hasPoints?: boolean;
  points?: number;
};
export default function ListActionItem({
  title,
  description,
  onPress,
  hasPoints = false,
  points,
}: Readonly<ListActionItemProps>) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View>
        {hasPoints && points !== undefined && (
          <Text>
            {points} {points == 1 ? "ponto" : "pontos"}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    wordWrap: "break-word",
  },
  description: {
    fontSize: 14,
    color: "#333",
    wordWrap: "break-word",
  },
});
