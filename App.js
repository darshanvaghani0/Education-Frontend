import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './src/app/features/auth/LoginPage';
import ToastConfig from './src/app/features/toastConfig';
import Toast from 'react-native-toast-message';
import HomeScreen from './src/app/features/screen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isOldVersion, setIsOldVersion] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    checkLoginStatus();
    // checkVersion();
  }, []);

  // const checkVersion = async () => {
  //   get('/app_version/latest', {})
  //     .then((response) => {
  //       console.log(response);
  //       if (response.status == 'success') {
  //         if (versionInfo['newVersionName'] != response.data.version) {
  //           setIsOldVersion(true)
  //           setDownloadLink(response.data.url)
  //         }
  //       }
  //     })
  // }

  const checkLoginStatus = async () => {
    try {
      const data = await AsyncStorage.getItem('loginData');
      console.log('called', data);
  
      if (!data) {
        setInitialRoute('Login');
        return false;
      }
  
      const { loginTime } = JSON.parse(data);
      if (!loginTime) {
        setInitialRoute('Login');
        return false;
      }
  
      const currentTime = new Date();
      const loginTimestamp = new Date(loginTime);
  
      if (isNaN(loginTimestamp.getTime())) {
        console.error('Invalid login timestamp');
        setInitialRoute('Login');
        return false;
      }
  
      const hoursDifference = (currentTime - loginTimestamp) / (1000 * 60 * 60);
  
      if (hoursDifference > 24) {
        await AsyncStorage.removeItem('loginData');
        setInitialRoute('Login');
        return false;
      }
  
      setInitialRoute('Home');
      return true;
    } catch (error) {
      console.error('Error checking login status:', error);
      setInitialRoute('Login');
      return false;
    }
  };
  

  if (initialRoute === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={ToastConfig} />
      {/* <VersionUpdateModal isVisible={isOldVersion} downloadLink={downloadLink} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
