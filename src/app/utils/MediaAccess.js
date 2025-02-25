import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

/**
 * Request specific permissions for Android.
 * @param {Array<string>} permissions - List of permissions to request.
 * @returns {Promise<boolean>} - True if all permissions are granted, otherwise false.
 */
export const requestPermissions = async (permissions) => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const allGranted = permissions.every(
        (perm) => granted[perm] === PermissionsAndroid.RESULTS.GRANTED
      );
      return allGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  // iOS does not require runtime permissions
  return true;
};

/**
 * Open the device's image gallery.
 * @returns {Promise<Object|null>} - Selected image object or null if canceled.
 */
export const openGallery = async () => {
  const permissions =
    Platform.Version >= 33
      ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
      : [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];

  const hasPermission = await requestPermissions(permissions);
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Gallery access is required to select images.');
    return null;
  }

  return new Promise((resolve) => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled gallery picker');
        resolve(null);
      } else if (response.errorMessage) {
        console.error('Gallery Error:', response.errorMessage);
        resolve(null);
      } else {
        resolve(response.assets[0]); // Return the selected asset
      }
    });
  });
};

/**
 * Open the device's camera.
 * @returns {Promise<Object|null>} - Captured image object or null if canceled.
 */
export const openCamera = async () => {
  const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];
  const hasPermission = await requestPermissions(permissions);
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera access is required to take photos.');
    return null;
  }

  return new Promise((resolve) => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled camera');
        resolve(null);
      } else if (response.errorMessage) {
        console.error('Camera Error:', response.errorMessage);
        resolve(null);
      } else {
        resolve(response.assets[0]); // Return the captured asset
      }
    });
  });
};
