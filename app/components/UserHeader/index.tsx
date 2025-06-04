import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type UserHeaderProps = {
  userName: string;
  userType: string;
};
export default function UserHeader({
  userName,
  userType,
}: Readonly<UserHeaderProps>) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16, fontWeight: 600 }}>
        <Feather
          name="user"
          size={16}
          color="#000"
          style={{ marginRight: 8 }}
        />
        {userName}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: 600 }}>
        <Feather
          name="briefcase"
          size={16}
          color="#000"
          style={{ marginRight: 8 }}
        />
        {userType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
});
