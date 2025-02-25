import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './src/app/features/auth/LoginPage';
import ToastConfig from './src/app/features/toastConfig';
import Toast from 'react-native-toast-message';
import HomeScreen from './src/app/features/screen/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isOldVersion, setIsOldVersion] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  useEffect(() => {
    // checkLoginStatus();
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

  // const checkLoginStatus = async () => {
  //   const data = await AsyncStorage.getItem('loginData');
  //   if (data) {
  //     const { loginTime } = JSON.parse(data);
  //     const currentTime = new Date();
  //     const loginTimestamp = new Date(loginTime);

  //     const hoursDifference = Math.abs(currentTime - loginTimestamp) / (1000 * 60 * 60);

  //     if (hoursDifference > 24) {
  //       await AsyncStorage.removeItem('loginData');
  //       setInitialRoute('Login');
  //       return false;
  //     } else {
  //       const selectedBranch = await AsyncStorage.getItem('selectedBranch')
  //       if(selectedBranch){
  //         setInitialRoute('Home');
  //       }else{
  //         setInitialRoute('BranchSelect');
  //       }
  //       return true;
  //     }
  //   } else {
  //     setInitialRoute('Login');
  //     return false;
  //   }
  // }

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
