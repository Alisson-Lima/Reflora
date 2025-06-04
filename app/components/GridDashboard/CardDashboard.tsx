import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title: string;
  description?: string;
  count?: string;
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
}

export default function CardDashboard({ title, description, count, icon = "activity", color = "#457b9d" }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color + "22" }]}>
      <View style={styles.iconWrapper}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {count && <Text style={styles.count}>{count}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconWrapper: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d3557",
  },
  description: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  count: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1d3557",
    marginTop: 8,
  },
});
