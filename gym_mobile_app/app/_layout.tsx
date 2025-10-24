import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Define screens where header should NOT be shown
  const hideHeaderScreens = ['/login', '/register', '/'];
  const shouldShowHeader = !hideHeaderScreens.includes(pathname);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
        {/* Conditionally render header */}
        {shouldShowHeader && <Header />}
        
        {/* Main content area */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Auth Screens (directly in app/) */}
            <Stack.Screen name="home" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />

            {/* Onboarding questions */}
            <Stack.Screen name="questions" />

            {/* Role-based dashboards */}
            <Stack.Screen name="dashboards" />

            {/* Not Found fallback */}
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
        
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
});