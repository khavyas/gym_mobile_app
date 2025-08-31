import { View, Text, StyleSheet } from "react-native";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📊 Admin Dashboard</Text>
      <Text style={styles.sub}>Manage gym users, consultants, and schedules</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, fontWeight: "bold" },
  sub: { marginTop: 8, fontSize: 16, color: "gray" },
});
