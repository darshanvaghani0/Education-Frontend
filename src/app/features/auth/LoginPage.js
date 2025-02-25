import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { RadioButton } from 'react-native-paper'; // Import RadioButton
import { postApi } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import versionInfo from './../../../../version.json';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState('Teacher');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [appVersion, setAppVersion] = useState('');
  const [companyName, setCompanyName] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setAppVersion(versionInfo['newVersionName'] || '1.0.0');
    setCompanyName(versionInfo['companyName'] || 'Your Company');
  }, []);

  const handleLogin = () => {
    setErrorMessage('');
    if (!username || !password) {
      setErrorMessage(!username ? 'Please enter your username' : 'Please enter your password');
      return;
    }

    setLoading(true);
    const body = { email: username, password };

    postApi('/users/signin', body)
      .then(async (response) => {
        setLoading(false);
        if (response.status === 'success') {
          const loginTime = new Date().toISOString();
          await AsyncStorage.setItem('loginData', JSON.stringify({ response, loginTime }));
          Toast.show({
            type: 'success',
            position: 'top',
            text1: `Welcome, ${response.data.name}!`,
            text2: 'You have successfully logged in.',
          });
          navigation.navigate('Home')
        } else {
          setErrorMessage('Invalid username or password');
        }
      })
      .catch(() => {
        setLoading(false);
        Toast.show({
          type: 'error',
          position: 'top',
          text2: 'An error occurred. Please try again later.',
        });
      });
  };

  const handleSignup = () => {
    setErrorMessage('');
    if (!name || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    setLoading(true);
    const body =
    {
      "name": name,
      "email": email,
      "password": password,
      "role_id": userType == 'Student' ? 1 : 2
    }

    postApi('/users/signup', body)
      .then(async (response) => {
        setLoading(false);
        if (response.status === 'success') {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: `Welcome, ${name}!`,
            text2: 'Your account has been created successfully.',
          });
          setIsSignup(false);
        } else {
          setErrorMessage(response.message || 'Signup failed');
        }
      })
      .catch(() => {
        setLoading(false);
        Toast.show({
          type: 'error',
          position: 'top',
          text2: 'An error occurred. Please try again later.',
        });
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image style={styles.image} source={require('../../../assets/login-page.jpg')} />

        <View style={styles.loginBox}>
          <Text style={styles.title}>{isSignup ? 'Create an Account' : 'Login to your Account'}</Text>

          {isSignup && (
            <>
              <Text style={styles.label}>Select Role</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioButton}>
                  <RadioButton
                    value="Student"
                    color="#1E90FF" // Blue color
                    status={userType === 'Student' ? 'checked' : 'unchecked'}
                    onPress={() => setUserType('Student')}
                  />
                  <Text>Student</Text>
                </View>

                <View style={styles.radioButton}>
                  <RadioButton
                    value="Teacher"
                    color="#1E90FF" // Blue color
                    status={userType === 'Teacher' ? 'checked' : 'unchecked'}
                    onPress={() => setUserType('Teacher')}
                  />
                  <Text>Teacher</Text>
                </View>
              </View>

              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="lightgray" value={name} onChangeText={setName} />
            </>
          )}

          <Text style={styles.label}>{isSignup ? 'Email' : 'Username'}</Text>
          <TextInput style={styles.input} placeholder={isSignup ? 'Enter your email' : 'Enter your username'} placeholderTextColor="lightgray" keyboardType="email-address" value={isSignup ? email : username} onChangeText={isSignup ? setEmail : setUsername} />

          <Text style={styles.label}>Password</Text>
          <TextInput style={[styles.input, { color: 'black' }]} placeholder="Enter your password" placeholderTextColor="lightgray" secureTextEntry value={password} onChangeText={setPassword} />

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.button} onPress={isSignup ? handleSignup : handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.linkText}>{isSignup ? 'Already have an account? ' : "Don't have an account? "}<Text style={[styles.linkText, { color: '#1E90FF' }]}>{isSignup ? 'Login' : "Create Account"}</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  loginBox: {
    marginTop: -30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#000000', // Changed to black
    marginTop: 10,
  },
});

export default LoginPage;
