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
  
  // State to manage the current level
  const [currentLevel, setCurrentLevel] = useState('standards'); // 'standards', 'subjects', 'chapters'
  const [data, setData] = useState([]); 
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useFocusEffect(
    useCallback(() => {
      

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [currentLevel, selectedStandard])
  );

  const handleBackPress = () => {
    if (currentLevel === 'chapters') {
      setCurrentLevel('subjects');
      fetchSubjects(selectedStandard);
    } else if (currentLevel === 'subjects') {
      setCurrentLevel('standards');
      fetchStandards();
    } else {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit the app?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
    }
    return true;
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      get('/standards/').then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('standards');
        }
      });
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };

  const fetchSubjects = async (standardId) => {
    try {
      get(`/subjects/${standardId}`).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('subjects');
          setSelectedStandard(standardId);
        }
      });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchChapters = async (subjectId) => {
    try {
      get(`/chapters/${subjectId}`).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('chapters');
          setSelectedSubject(subjectId);
        }
      });
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title={currentLevel === 'standards' ? 'Select Standard' : currentLevel === 'subjects' ? 'Select Subject' : 'Select Chapter'} 
        backButtonVisible={currentLevel !== 'standards'} 
        onBackPress={handleBackPress}
        profileVisible={true} 
      />
      
      <View style={styles.content}>
        {data.map((item) => (
          <Button
            key={item.id}
            onPress={() => {
              if (currentLevel === 'standards') {
                fetchSubjects(item.id);
              } else if (currentLevel === 'subjects') {
                fetchChapters(item.id);
              } else {
                navigation.navigate('ChapterDetails', { chapterId: item.id });
              }
            }}
            text={item.subject_name || item.standard_name || item.chapter_name} // Handle different API responses
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
