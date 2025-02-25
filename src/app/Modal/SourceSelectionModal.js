import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


const SourceSelectionModal = ({ isVisible, onClose, onSelectSource }) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.modalTitle}>Select Options</Text>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Image source={require('../../assets/cancel.png')} style={styles.cancelButtonImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />
          <Text style={styles.modalMessage}>Choose the source for selecting the image:</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.buttonStyle, styles.shadowEffect]}
              onPress={() => onSelectSource('camera')}
              activeOpacity={0.8}
            >
              <Image source={require('../../assets/camera_icon.png')} style={styles.cameraImage} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonStyle, styles.shadowEffect]}
              onPress={() => onSelectSource('gallery')}
              activeOpacity={0.8}
            >
              <Image source={require('../../assets/gallery_icon.png')} style={styles.galleryImage} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  cancelButton: {
    position: 'absolute',
    top: 13,
    right: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonImage: {
    width: 20,
    height: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 13,
    paddingHorizontal: 15,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin:10,
    marginBottom:20
  },
  buttonStyle: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  shadowEffect: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
  cameraImage: {
    width: 25,
    height: 25,
  },
  galleryImage: {
    width: 35,
    height: 35,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default SourceSelectionModal;
