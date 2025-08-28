import { Stack } from 'expo-router';

export default function QuestionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user-questions" />
      <Stack.Screen name="consultant-questions" />
    </Stack>
  );
}