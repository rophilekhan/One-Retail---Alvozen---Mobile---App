import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, PermissionsAndroid, AppState, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';

/**
 * useDevicePermission - Generic Cross-Device Native OS Permission Hook
 * Works identically across all Android versions (Android 10–15+) and iOS:
 *
 * 1. Native OS Dialog Trigger:
 *    - Android: Checks PermissionsAndroid.PERMISSIONS.CAMERA, and if not granted, calls
 *      PermissionsAndroid.request(...) with native alert options.
 *    - iOS: Uses Camera.getCameraPermissionStatus() and Camera.requestCameraPermission().
 * 2. Handles all 3 permission states:
 *    - 'granted': Active camera feed
 *    - 'denied': Can re-prompt native OS dialog
 *    - 'blocked': Permanently denied ('never_ask_again'); requires Linking.openSettings()
 * 3. Auto-Resume:
 *    - AppState listener automatically re-checks on 'active' when user returns from Phone Settings.
 *
 * @param {'camera' | 'location'} [type='camera']
 * @param {boolean} [autoRequest=true]
 * @returns {{
 *   status: 'undetermined' | 'granted' | 'denied' | 'blocked',
 *   hasPermission: boolean,
 *   requestPermission: () => Promise<string>,
 *   checkPermission: () => Promise<string>,
 *   openSettings: () => Promise<void>,
 * }}
 */
export const useDevicePermission = (type = 'camera', autoRequest = true) => {
  const [status, setStatus] = useState('undetermined');
  const appStateRef = useRef(AppState.currentState);

  /**
   * Check current OS permission status without triggering dialog
   */
  const checkPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const androidPermission =
          type === 'camera'
            ? PermissionsAndroid?.PERMISSIONS?.CAMERA || 'android.permission.CAMERA'
            : PermissionsAndroid?.PERMISSIONS?.ACCESS_FINE_LOCATION || 'android.permission.ACCESS_FINE_LOCATION';

        if (typeof PermissionsAndroid?.check === 'function') {
          const isGranted = await PermissionsAndroid.check(androidPermission);
          if (isGranted) {
            setStatus('granted');
            return 'granted';
          }
        }

        // If not granted, we stay in denied or blocked
        setStatus((prev) => (prev === 'blocked' ? 'blocked' : 'denied'));
        return 'denied';
      } else {
        // iOS
        if (type === 'camera') {
          if (typeof Camera?.getCameraPermissionStatus === 'function') {
            const cameraStatus = await Camera.getCameraPermissionStatus();
            if (cameraStatus === 'granted') {
              setStatus('granted');
              return 'granted';
            } else if (cameraStatus === 'denied' || cameraStatus === 'restricted') {
              setStatus('blocked');
              return 'blocked';
            } else {
              setStatus('undetermined');
              return 'undetermined';
            }
          }
        }
      }
    } catch (err) {
      // In case of mock or test environments, fallback safely
    }
    return 'denied';
  }, [type]);

  /**
   * Request native OS permission (triggers system popup or directs to settings if blocked)
   */
  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const androidPermission =
          type === 'camera'
            ? PermissionsAndroid?.PERMISSIONS?.CAMERA || 'android.permission.CAMERA'
            : PermissionsAndroid?.PERMISSIONS?.ACCESS_FINE_LOCATION || 'android.permission.ACCESS_FINE_LOCATION';

        // Check if already granted
        if (typeof PermissionsAndroid?.check === 'function') {
          const alreadyGranted = await PermissionsAndroid.check(androidPermission);
          if (alreadyGranted) {
            setStatus('granted');
            return 'granted';
          }
        }

        // Trigger native OS dialog
        if (typeof PermissionsAndroid?.request === 'function') {
          const result = await PermissionsAndroid.request(androidPermission, {
            title: 'Camera Permission',
            message: 'OneRetail needs camera access to scan prescription QR codes.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          });

          if (result === PermissionsAndroid.RESULTS.GRANTED || result === 'granted') {
            setStatus('granted');
            return 'granted';
          } else if (
            result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
            result === 'never_ask_again'
          ) {
            setStatus('blocked');
            return 'blocked';
          } else {
            setStatus('denied');
            return 'denied';
          }
        }
      } else {
        // iOS
        if (type === 'camera') {
          if (typeof Camera?.requestCameraPermission === 'function') {
            const result = await Camera.requestCameraPermission();
            if (result === 'granted') {
              setStatus('granted');
              return 'granted';
            } else {
              // Denied on iOS cannot be re-prompted without Settings
              setStatus('blocked');
              return 'blocked';
            }
          }
        }
      }
    } catch (err) {
      // Fallback
    }
    setStatus('denied');
    return 'denied';
  }, [type]);

  /**
   * Open phone OS settings
   */
  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      // Ignore openSettings errors
    }
  }, []);

  // Initial check & auto-request on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const current = await checkPermission();
      if (isMounted && autoRequest && current !== 'granted' && current !== 'blocked') {
        await requestPermission();
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [autoRequest, checkPermission, requestPermission]);

  // Auto-Resume: Listen for app coming back to foreground from phone settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // User just returned from settings or other app: re-check immediately
        await checkPermission();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermission]);

  return {
    status,
    hasPermission: status === 'granted',
    requestPermission,
    checkPermission,
    openSettings,
  };
};

export default useDevicePermission;
