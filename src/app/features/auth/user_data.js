import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'loginData'; // Storage key for user data

// Save user data after login
export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Retrieve stored user data
export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

// Check if user is a teacher (role_id === 2)
export const isTeacher = async () => {
  const user = await getUser();
  console.log(user?.response?.data?.role_id === 2)
  return user?.response?.data?.role_id === 2;
};

// Get user ID (for API requests)
export const getUserId = async () => {
  const user = await getUser();
  return user?.response?.data?.id || null;
};

// Get authentication token
export const getToken = async () => {
  const user = await getUser();
  return user?.response?.data?.access_token || null;
};

// Logout function
export const logout = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
