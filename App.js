import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './src/app/features/auth/LoginPage';
import ToastConfig from './src/app/features/toastConfig';
import Toast from 'react-native-toast-message';
import HomeScreen from './src/app/features/screen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChapterPDFScreen from './src/app/features/screen/ChapterPDFScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NewSignUpUser from './src/app/features/screen/NewSignUpUser';
import { colors } from './src/app/theme/theme';
import PermissionComponent from './src/app/utils/PermissionComponent';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background.secondary}
      />
      <SafeAreaView style={styles.container}>
        <PermissionComponent />
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
            <Stack.Screen
              name="ChapterDetails"
              component={ChapterPDFScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="NewSignUpUser"
              component={NewSignUpUser}
              options={{ headerShown: false }}
            />

          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={ToastConfig} />
        {/* <VersionUpdateModal isVisible={isOldVersion} downloadLink={downloadLink} /> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
