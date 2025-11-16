import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  
  // Auth state management
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      
      if (token && role) {
        // User is authenticated
        setIsAuthenticated(true);
        
        // Only redirect if we're on login/register/home screens
        const publicScreens = ['/login', '/register', '/home', '/'];
        if (publicScreens.includes(pathname)) {
          // Navigate to appropriate dashboard based on role
          const normalizedRole = role.toLowerCase();
          switch (normalizedRole) {
            case 'user':
              router.replace('/dashboards/user');
              break;
            case 'consultant':
              router.replace('/dashboards/consultant');
              break;
            case 'admin':
              router.replace('/dashboards/admin');
              break;
            case 'superadmin':
            case 'super-admin':
              router.replace('/dashboards/super-admin');
              break;
            default:
              router.replace('/dashboards/user');
              break;
          }
        }
      } else {
        // No token found, user needs to login
        setIsAuthenticated(false);
        
        // Only redirect to login if user is trying to access protected routes
        const protectedRoutes = ['/dashboards', '/questions'];
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        
        if (isProtectedRoute) {
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      router.replace('/login');
    } finally {
      setIsAuthChecking(false);
    }
  };

  // Show loading screen while fonts are loading OR auth is being checked
  if (!loaded || isAuthChecking) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.brandName}>HiWox</Text>
          <ActivityIndicator size="large" color="#10B981" style={styles.spinner} />
          <Text style={styles.loadingText}>
            {!loaded ? 'Loading fonts...' : 'Checking authentication...'}
          </Text>
        </View>
      </View>
    );
  }

  // Define screens where header should NOT be shown
  const hideHeaderScreens = ['/login', '/register', '/home'];
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
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 24,
  },
  spinner: {
    marginVertical: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});