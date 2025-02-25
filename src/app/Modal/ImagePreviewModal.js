import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { post, uploadImage } from '../../services/api';
import Toast from 'react-native-toast-message';
import { ToastConfig } from '../features/toastConfig';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from "react-native-element-dropdown";
import ConfirmationModal from './ConfirmationModal';

const ImagePreviewModal = ({ isVisible, selectedImage, onClose, isCameraSelected, setSelectedImage, setIsCameraSelected, setIsPreviewModalVisible, isFromPendingPod, PODId }) => {

  const [showBiltyInput, setShowBiltyInput] = useState(false);
  const [showBiltyError, setShowBiltyError] = useState(false);
  const [biltyErrorMessage, setBiltyErrorMessage] = useState('');
  const [showBiltyErrorMessage, setShowBiltyErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biltyNo, setBiltyNo] = useState('');
  const biltyInputRef = useRef(null);
  const [suffixData, setSuffixData] = useState([]);
  const [isMultipleSuffix, setIsMultipleSuffix] = useState(false);
  const [selectedBiltyId, setSelectedBiltyId] = useState(null);
  const [suffixError, setSuffixError] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const confirmBiltyId = useRef();


  useEffect(() => {
    setTimeout(() => {
      if (showBiltyInput && biltyInputRef.current) {
        biltyInputRef.current.focus();
      }
    }, 500);
  }, [showBiltyInput]);

  const handleUpload = async () => {
    if (isFromPendingPod) {
      uploadWithoutBiltyId(PODId)
    } else {
      if (isMultipleSuffix) {
        if (selectedBiltyId) {
          setSuffixError(false);
          await uploadWithoutBiltyId(selectedBiltyId);
          return;
        } else {
          setSuffixError(true);
          return;
        }
      } else if (showBiltyInput) {
        uploadWithBiltyId();
      } else {
        await uploadWithoutBiltyId();
      }
    }
  };

  const handleUploadAgain = async (biltyNo) => {
    if (biltyNo) {
      await uploadWithBiltyId(biltyNo);
    } else {
      await uploadWithoutBiltyId(confirmBiltyId.current);
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (!selectedImage) {
        onClose();
      }
    }, [selectedImage])
  );


  const uploadWithoutBiltyId = async (bilty_id) => {
    if (!selectedImage) {
      Alert.alert('Error', 'No image selected to upload.');
      return;
    }
    let params = { 'type': 'bilty_pod', 'client_name': 'rcc' }
    if (bilty_id) {
      params['bilty_id'] = bilty_id
    }
    setIsLoading(true);
    uploadImage('/pod_image/upload_pod_app', params, selectedImage)
      .then(async (response) => {
        console.log(response);
        if (response.status == 'success') {
          if (response.data.status) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: `POD image save successfully!`,
            });
            if (!isCameraSelected) {
              onClose();
            } else {
              setTimeout(async () => {
                await openCameraForScan();
              }, 500);
            }
          } else if (response.data.error == 'Multiple bilty numbers found') {
            setSuffixData(response.data.bilty_data);
            setConfirmationVisible(true)
          } else if (response.data.error == 'No bilty_id found.') {
            setShowBiltyInput(true)
            setShowBiltyErrorMessage(true)
            setBiltyErrorMessage('Error in scanning QR code. Enter the bilty number and upload again.')
          } else if (response.data.error == 'Confirm the bilty no.') {
            setSuffixData(response.data.bilty_data)
            setConfirmationVisible(true)
          } else {
            setShowBiltyInput(true)
            setShowBiltyErrorMessage(true)
            setBiltyErrorMessage('Error in scanning QR code. Enter the bilty number and upload again.')
          }
        } else {
          setShowBiltyInput(true)
          setShowBiltyErrorMessage(true)
          setBiltyErrorMessage('Error in scanning QR code. Enter the bilty number and upload again.')
        }
      })
      .finally(() => setIsLoading(false));
  }

  const openCameraForScan = async () => {
    if (isCameraSelected) {
      const { scannedImages } = await DocumentScanner.scanDocument({ maxNumDocuments: 1, quality: 100, resolution: 300 });
      setShowBiltyInput(false)
      setShowBiltyError(false)
      setBiltyErrorMessage('')
      setBiltyNo('')
      setSelectedImage(null)
      setSelectedBiltyId(null)
      setSuffixError(false)
      setIsMultipleSuffix(false)
      setSuffixData([])
      setShowBiltyErrorMessage(false)
      if (scannedImages.length > 0) {
        let image = scannedImages[0];
        if (image) {
          setSelectedImage(image);
          setIsPreviewModalVisible(true);
          setIsCameraSelected(true);
        }
      } else {
        onClose();
      }
    }
  }

  const uploadWithBiltyId = async (no) => {
    setIsLoading(true);
    setShowBiltyError(false)
    post('/bilty/get_bilty_no_for_pod', { 'bilty_no': Number(no ? no : biltyNo) })
      .then((response) => {
        console.log(response);
        if (response.status == 'success') {
          if (!response.data.message) {
            if (response.data.length > 1) {
              setShowBiltyErrorMessage(true)
              setBiltyErrorMessage('Multiple bilty found. select the suffix and upload again.')
              setSuffixData(response.data)
              setIsMultipleSuffix(true)
            } else {
              uploadWithoutBiltyId(response.data[0].bilty_id)
            }
          } else {
            setShowBiltyInput(true)
            setShowBiltyErrorMessage(true)
            setBiltyErrorMessage('Error in scanning QR code. Enter the bilty number and upload again.')
            setShowBiltyError(true)
          }
        } else {
          setShowBiltyInput(true)
          setShowBiltyErrorMessage(true)
          setBiltyErrorMessage('Error in scanning QR code. Enter the bilty number and upload again.')
          setShowBiltyError(true)
        }
      }).finally(() => setIsLoading(false));
  }


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
              <Text style={styles.modalTitle}>POD Image</Text>
            </View>
            <TouchableOpacity style={[styles.cancelButton, isLoading && { backgroundColor: 'lightgray' }]} disabled={isLoading} onPress={onClose}>
              <Image source={require('../../assets/cancel.png')} style={styles.cancelButtonImage} />
            </TouchableOpacity>
          </View>
          <View style={[isLoading && styles.disabledModal]}>
            <View style={styles.separator} />
            {selectedImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {showBiltyErrorMessage && <Text style={[styles.biltyErrorMessage, { marginTop: 10, paddingHorizontal: 30 }]}>{biltyErrorMessage}</Text>}

            {showBiltyInput && (
              <View style={styles.biltyContainer}>
                <TextInput
                  ref={biltyInputRef}
                  style={[styles.input, { color: 'black' }]}
                  placeholder="Enter bilty number."
                  placeholderTextColor="lightgray"
                  value={biltyNo}
                  onChangeText={(text) => setBiltyNo(text)}
                  onSubmitEditing={() => handleUpload()}
                />
                {showBiltyError && <Text style={[styles.biltyErrorMessage, { fontSize: 9 }]}>Enter Valid Bilty Number.</Text>}
              </View>
            )}
            {isMultipleSuffix && <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Select suffix:</Text>
              <Dropdown
                style={styles.dropdown}
                data={suffixData.map((item) => ({
                  label: item.suffix,
                  value: item.bilty_id,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                itemTextStyle={styles.itemText}
                itemContainerStyle={styles.itemContainer}
                value={selectedBiltyId}
                onChange={(item) => setSelectedBiltyId(item.value)}
              />
              {suffixError && <Text style={[styles.biltyErrorMessage, { fontSize: 9 }]}>Select the suffix.</Text>}
            </View>}
          </View>
          <View style={[styles.separator, { marginTop: 10 }]} />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={[styles.buttonStyle, (isLoading) && { backgroundColor: 'lightgray' }]} disabled={isLoading} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, isLoading && { backgroundColor: 'lightgray' }]} disabled={isLoading} onPress={handleUpload}>
              <Text style={styles.buttonText}>{(showBiltyInput || isMultipleSuffix) ? 'Upload Again' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </View>
      {(isCameraSelected || isConfirmationVisible) && <Toast />}

      {isConfirmationVisible && <ConfirmationModal
        isVisible={isConfirmationVisible}
        onClose={() => { setConfirmationVisible(false); }}
        suffixData={suffixData}
        setSelectedBiltyId={setSelectedBiltyId}
        setBiltyNo={setBiltyNo}
        handleUploadAgain={handleUploadAgain}
      />}
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
    width: 20,
    borderRadius: 15,
    height: 20,
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
  previewImage: {
    width: '100%',
    height: 200,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    marginLeft: 10,
    minWidth: 100,
    height: 35,
  },
  buttonText: {
    color: 'black',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    width: '100%',
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
  disabledModal: {
    opacity: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 7,
    marginTop: 10,
    fontSize: 13,
  },
  biltyContainer: {
    paddingHorizontal: 30
  },
  biltyErrorMessage: {
    color: 'red',
    fontSize: 12
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 30,
    fontSize: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 7,
  },
  dropdown: {
    height: 35,
    width: 140,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholder: {
    fontSize: 13,
    color: "gray",
  },
  selectedText: {
    fontSize: 13,
  },
  itemText: {
    fontSize: 13,
  },
  itemContainer: {
    backgroundColor: "#f8f9fa", // Light gray background
    // paddingVertical: 10,
    // paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Light border for each option
  },
});

export default ImagePreviewModal;
