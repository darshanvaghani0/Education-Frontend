import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const DocumentScannerScreen = () => {
  const [scannedImage, setScannedImage] = useState(null);

  const handleScanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({maxNumberDocuments :1});
      if (scannedImages.length > 0) {
        setScannedImage(scannedImages[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to scan document. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Scan Document" onPress={handleScanDocument} />
      {scannedImage && (
        <Image source={{ uri: scannedImage }} style={styles.imagePreview} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 300,
    height: 400,
    marginTop: 20,
  },
});

export default DocumentScannerScreen;
