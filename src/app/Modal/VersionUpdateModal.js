import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking  } from 'react-native';
import Toast from 'react-native-toast-message';

const VersionUpdateModal = ({ isVisible, downloadLink}) => {

  const handleDownload = () => {
    if (downloadLink) {
      Linking.openURL(downloadLink).catch(err => 
        console.error("Failed to open link:", err)
      );
    } else {
      console.error("Download link is not provided");
    }
  };
  
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>New Update Available</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.contentContainer}>
            <Text style={styles.description}>A new version of the app is available. Please update to continue.</Text>
          </View>
          <View style={[styles.separator, { marginTop: 10 }]} />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity 
              style={[styles.buttonStyle]}  
              onPress={handleDownload}>
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    width: '100%',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 120,
    height: 40,
  },
  buttonText: {
    color: 'black',
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VersionUpdateModal;
