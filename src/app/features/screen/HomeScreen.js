import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, BackHandler, Alert } from 'react-native';
import CustomHeader from '../CustomHeader';
import { get } from '../../../services/api';
import { isTeacher } from '../auth/user_data';
import ConfirmationModal from '../../Modal/ConfirmationModal';
import Toast from 'react-native-toast-message';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [isUserTeacher, setIsUserTeacher] = useState(false)

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
    const initializeData = async () => {
      const teacherStatus = await isTeacher();
      setIsUserTeacher(teacherStatus);
      await fetchStandards();
    };

    initializeData();
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

  const fetchSubjects = async (standard) => {
    try {
      get(`/subjects/${standard.id}`).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('subjects');
          setSelectedStandard(standard);
        } else {
          if(isUserTeacher){
            setData([]);
            setCurrentLevel('subjects');
            setSelectedStandard(standard);
          }
          Toast.show({
            type: 'error',
            position: 'top',
            text1: `No Subjects Found For ${standard.standard_name}`,
            text2: '',
          });
        }
      });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchChapters = async (subject) => {
    try {
      get(`/chapters/${subject.id}`).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('chapters');
          setSelectedSubject(subject);
        } else {
          if(isUserTeacher){
            setData([]);
            setCurrentLevel('chapters');
            setSelectedStandard(subject);
          }
          Toast.show({
            type: 'error',
            position: 'top',
            text1: `No Subjects Found For ${subject.subject_name}`,
            text2: '',
          });
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

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Button
            onPress={() => {
              if (currentLevel === 'standards') {
                fetchSubjects(item);
              } else if (currentLevel === 'subjects') {
                fetchChapters(item);
              } else {
                navigation.navigate('ChapterDetails', { chapterId: item.id });
              }
            }}
            text={item.subject_name || item.standard_name || item.chapter_name} // Handle different API responses
          />
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isUserTeacher && (
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )
        }
      />

      {modalVisible && (
        <ConfirmationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          currentLevel={currentLevel}
          selectedStandard={selectedStandard}
          selectedSubject={selectedSubject}
          refreshData={() => {
            if (currentLevel === 'standards') fetchStandards();
            if (currentLevel === 'subjects') fetchSubjects(selectedStandard);
            if (currentLevel === 'chapters') fetchChapters(selectedSubject);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    alignItems: 'center',
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
  addButton: {
    backgroundColor: 'green',
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  addText: { fontSize: 25, color: 'white', fontWeight: 'bold' },
});

export default HomeScreen;
