import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Shop() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <Text className="text-2xl font-bold mb-4">Shop</Text>
        <Text className="text-gray-500">
          Browse fitness gear, supplements, and training packages here.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
