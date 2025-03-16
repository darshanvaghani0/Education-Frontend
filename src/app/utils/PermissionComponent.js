import React, { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { PERMISSIONS, requestMultiple, checkMultiple, RESULTS } from 'react-native-permissions';

const checkAndRequestPermissions = async () => {
  try {
    const permissions = Platform.select({
      android: [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ],
      ios: []
    });

    if (permissions) {
      // First check current permission statuses
      const currentStatuses = await checkMultiple(permissions);

      // Filter permissions that need to be requested
      const permissionsToRequest = permissions.filter(
        permission => currentStatuses[permission] === RESULTS.DENIED
      );

      // Check for blocked permissions
      const blockedPermissions = permissions.filter(
        permission => currentStatuses[permission] === RESULTS.BLOCKED
      );

      if (blockedPermissions.length > 0) {
        Linking.openSettings();
        return;
      }

      if (permissionsToRequest.length > 0) {
        // Only request permissions that aren't granted
        await requestMultiple(permissionsToRequest);
      }
    }
  } catch (error) {
    console.error('Error handling permissions:', error);
  }
};

const PermissionComponent = () => {
  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  return null; // Replace with your actual UI component
};

export default PermissionComponent;
