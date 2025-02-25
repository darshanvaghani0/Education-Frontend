import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, BackHandler, Alert } from 'react-native';
import CustomHeader from '../CustomHeader';
import { get } from '../../../services/api';

const { width } = Dimensions.get('window');

const Button = ({ onPress, text }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Image style={styles.iconLeft} source={require('../../../assets/clipboard.png')} />
    <Text style={styles.buttonText}>{text}</Text>
    <Image style={styles.iconRight} source={require('../../../assets/right.png')} />
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [standards, setStandards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [])
  );

  useEffect(() => {
    const fetchStandards = async () => {
      try {

        get('/standards/')
        .then((response) => {
          console.log(response);
          if (response.status == 'success') {
            setStandards(response.data);
          }
        })
        
      } catch (error) {
        console.error('Error fetching standards:', error);
      }
    };

    fetchStandards();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title="Home" backButtonVisible={false} profileVisible={true} />
      <View style={styles.content}>
        {standards.map((standard) => (
          <Button
            key={standard.id}
            onPress={() => navigation.navigate('Subjects', { standardId: standard.id })}
            text={standard.standard_name}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    textAlign: 'left',
    fontWeight: '500',
  },
  iconLeft: {
    marginRight: 15,
    width: 25,
    height: 25,
  },
  iconRight: {
    marginLeft: 10,
    width: 20,
    height: 20,
  },
});

export default HomeScreen;
