import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, BackHandler, Alert, TextInput } from 'react-native';
import CustomHeader from '../CustomHeader';
import { get } from '../../../services/api';
import { isTeacher } from '../auth/user_data';
import ConfirmationModal from '../../Modal/ConfirmationModal';
import Toast from 'react-native-toast-message';
import { colors, spacing, shadows, typography, borderRadius, commonStyles } from '../../theme/theme';

const { width } = Dimensions.get('window');

const Button = ({ onPress, text, currentLevel }) => {
  const getIcon = () => {
    switch (currentLevel) {
      case 'standards':
        return require('../../../assets/clipboard.png');
      case 'subjects':
        return require('../../../assets/books.png');
      case 'chapters':
        return require('../../../assets/chapter.png');
      default:
        return require('../../../assets/clipboard.png');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image style={[styles.iconLeft, { tintColor: colors.primary }]} source={getIcon()} />
      <Text style={styles.buttonText}>{text}</Text>
      <Image style={[styles.iconRight, { tintColor: colors.text.light }]} source={require('../../../assets/right.png')} />
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();

  // State to manage the current level
  const [currentLevel, setCurrentLevel] = useState('standards'); // 'standards', 'subjects', 'chapters'
  const [data, setData] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUserTeacher, setIsUserTeacher] = useState(false);
  const [searchText, setSearchText] = useState('');

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
      get(`/standards/`, { search_string: searchText }).then((response) => {
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
      get(`/subjects/${standard.id}`, { search_string: searchText }).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('subjects');
          setSelectedStandard(standard);
        } else {
          if (isUserTeacher) {
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
      get(`/chapters/${subject.id}`, { search_string: searchText }).then((response) => {
        if (response.status === 'success') {
          setData(response.data);
          setCurrentLevel('chapters');
          setSelectedSubject(subject);
        } else {
          if (isUserTeacher) {
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

  const handleSearch = () => {
    if (currentLevel === 'standards') {
      fetchStandards();
    } else if (currentLevel === 'subjects' && selectedStandard) {
      fetchSubjects(selectedStandard);
    } else if (currentLevel === 'chapters' && selectedSubject) {
      fetchChapters(selectedSubject);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={currentLevel === 'standards' ? 'Home' : currentLevel === 'subjects' ? selectedStandard.standard_name : selectedSubject.subject_name}
        backButtonVisible={currentLevel !== 'standards'}
        onBackPress={handleBackPress}
        profileVisible={true}
      />

      <Text style={styles.headerText}>{currentLevel === 'standards' ? 'Select Standard' : currentLevel === 'subjects' ? 'Select Subject' : 'Select Chapter'}</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../../../assets/search.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${currentLevel}...`}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            placeholderTextColor={colors.text.light}
          />
        </View>
      </View>
      {data.length > 0 ? (
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
              text={item.subject_name || item.standard_name || item.chapter_name}
              currentLevel={currentLevel}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No {currentLevel} found</Text>
        </View>
      )}

      {isUserTeacher && (
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Image style={styles.addIcon} source={require('../../../assets/plus.png')} />
        </TouchableOpacity>
      )}

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
    backgroundColor: colors.background.primary,
  },
  headerText: {
    ...typography.h3,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: colors.text.light,
    marginRight: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    ...shadows.sm,
  },
  buttonText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    marginLeft: spacing.md,
  },
  iconLeft: {
    width: 24,
    height: 24,
  },
  iconRight: {
    width: 20,
    height: 20,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  noDataText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  addButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  addIcon: {
    width: 24,
    height: 24,
    tintColor: colors.text.white,
  },
});

export default HomeScreen;
