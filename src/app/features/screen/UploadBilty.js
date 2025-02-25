import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import SourceSelectionModal from '../../Modal/SourceSelectionModal';
import ImagePreviewModal from '../../Modal/ImagePreviewModal';
import { openCamera, openGallery } from '../../utils/MediaAccess';
import DocumentScanner from 'react-native-document-scanner-plugin';
import CustomHeader from '../CustomHeader';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const UploadBilty = () => {
  const [isSourceModalVisible, setIsSourceModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraSelected, setIsCameraSelected] = useState(false);
  const navigation = useNavigation();

  // Handle selecting a source (camera or gallery)
  const handleSelectSource = async (source) => {
    setIsSourceModalVisible(false);
    let image = null;
    if (source === 'camera') {
      // image = await openCamera();
      const { scannedImages } = await DocumentScanner.scanDocument({ maxNumDocuments: 1, quality: 100, resolution: 300 });
      if (scannedImages.length > 0) {
        image = scannedImages[0];
        if (image) {
          setSelectedImage(image);
          setIsPreviewModalVisible(true);
          setIsCameraSelected(true);
        }
      }
    } else if (source === 'gallery') {
      image = await openGallery();
      if (image) {
        setSelectedImage(image.uri);
        setIsPreviewModalVisible(true);
        setIsCameraSelected(false);
      }
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Upload POD Image"
        backButtonVisible={true}
        profileVisible={true}
        onBackPress={handleBackPress}
      />
      <View style={styles.content}>
        {/* Dotted Border for Image Upload */}
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={() => setIsSourceModalVisible(true)}
        >
          <Image
            source={require('./../../../assets/upload-file.png')}
            style={styles.uploadIcon}
          />
          <Text style={styles.uploadText}>Click here to Upload Image</Text>
        </TouchableOpacity>
      </View>
      {/* Source Selection Modal */}
      {isSourceModalVisible && <SourceSelectionModal
        isVisible={isSourceModalVisible}
        onClose={() => setIsSourceModalVisible(false)}
        onSelectSource={handleSelectSource}
      />}

      {/* Image Preview Modal */}
      {isPreviewModalVisible && <ImagePreviewModal
        isVisible={isPreviewModalVisible}
        selectedImage={selectedImage}
        isCameraSelected={isCameraSelected}
        setSelectedImage={setSelectedImage}
        setIsCameraSelected={setIsCameraSelected}
        setIsPreviewModalVisible={setIsPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: height * 0.2,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  uploadContainer: {
    width: 300,
    height: 350,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 10,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 20,
    color: '#555',
  },
  uploadIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10
  },
});

export default UploadBilty;
