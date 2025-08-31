import { View, Text, StyleSheet } from 'react-native';

export default function UserHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 Welcome User!</Text>
      <Text style={styles.subText}>This is your personalized home page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827'
  },
  text: {
    fontSize: 24, fontWeight: 'bold', color: '#10B981'
  },
  subText: {
    fontSize: 16, marginTop: 8, color: '#9CA3AF'
  }
});
