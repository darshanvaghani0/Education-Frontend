import AsyncStorage from '@react-native-async-storage/async-storage';

export const validateSession = async (navigation) => {
  try {
    const data = await AsyncStorage.getItem('loginData');
    if (data) {
      const { loginTime } = JSON.parse(data);
      const currentTime = new Date();
      const loginTimestamp = new Date(loginTime);

      const hoursDifference = Math.abs(currentTime - loginTimestamp) / (1000 * 60 * 60);

      if (hoursDifference > 24) {
        await AsyncStorage.removeItem('loginData');
        navigation.navigate('Login');
        return false;
      } else {
        return true;
      }
    } else {
      navigation.navigate('Login');
      return false;
    }
  } catch (error) {
    console.error('Error validating session:', error);
    navigation.navigate('Login');
    return false;
  }
};
