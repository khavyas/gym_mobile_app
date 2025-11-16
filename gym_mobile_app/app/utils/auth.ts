import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

/**
 * Logs out the user by clearing all authentication data
 */
export const logout = async () => {
  try {
    // Clear all auth-related data from AsyncStorage
    await AsyncStorage.multiRemove([
      'userToken',
      'userRole',
      'userName',
      'userEmail',
      'userId'
    ]);
    
    console.log('User logged out successfully');
    
    // Navigate to login screen
    router.replace('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Validates if token exists (you can enhance this to check expiration)
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Gets current user info from AsyncStorage
 */
export const getCurrentUser = async () => {
  try {
    const [token, role, name, email, userId] = await AsyncStorage.multiGet([
      'userToken',
      'userRole', 
      'userName',
      'userEmail',
      'userId'
    ]);

    return {
      token: token[1],
      role: role[1],
      name: name[1],
      email: email[1],
      userId: userId[1]
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};