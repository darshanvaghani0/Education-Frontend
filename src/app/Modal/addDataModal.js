import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { post } from '../../../services/api';

const addDataModal = ({ visible, onClose, currentLevel, selectedStandard, selectedSubject, refreshData }) => {
  const [name, setName] = useState('');

  const getTitle = () => {
    return currentLevel === 'standards' ? 'Add Standard' :
           currentLevel === 'subjects' ? 'Add Subject' : 'Add Chapter';
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }

    let endpoint = '';
    let body = { created_by: 1 };

    if (currentLevel === 'standards') {
      endpoint = '/standards/';
      body.standard_name = name;
    } else if (currentLevel === 'subjects' && selectedStandard) {
      endpoint = '/subjects/';
      body.subject_name = name;
      body.standard_id = selectedStandard;
    } else if (currentLevel === 'chapters' && selectedSubject) {
      endpoint = '/chapters/';
      body.chapter_name = name;
      body.subject_id = selectedSubject;
    } else {
      Alert.alert('Error', 'Missing required selection.');
      return;
    }

    try {
      const response = await post(endpoint, body);
      if (response.status === 'success') {
        Alert.alert('Success', `${getTitle()} added successfully!`);
        setName('');
        onClose();
        refreshData();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{getTitle()}</Text>
          <TextInput style={styles.input} placeholder="Enter name" value={name} onChangeText={setName} />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
      marginBottom: 15,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonCancel: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    buttonSubmit: {
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 5,
      width: '45%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });

export default addDataModal;
