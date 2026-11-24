import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { ThemeProvider } from '../src/theme/index.js';
import { useDevicePermission } from '../src/hooks/useDevicePermission.js';
import { QRScannerScreen } from '../src/screens/prescription/QRScannerScreen.jsx';

describe('useDevicePermission Hook & QRScannerScreen Permission States', () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Platform.OS = originalOS;
  });

  const TestHookConsumer = ({ onHookValue }) => {
    const perm = useDevicePermission('camera', false);
    React.useEffect(() => {
      onHookValue(perm);
    }, [perm, onHookValue]);
    return null;
  };

  test('detects granted state on Android when check() returns true', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockImplementation(() => Promise.resolve(true));

    let hookResult;
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TestHookConsumer onHookValue={(val) => { hookResult = val; }} />
      );
    });

    await ReactTestRenderer.act(async () => {
      const res = await hookResult.checkPermission();
      expect(res).toBe('granted');
    });

    expect(hookResult.hasPermission).toBe(true);

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('handles requestPermission returning GRANTED on Android', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockImplementation(() => Promise.resolve(false));
    jest.spyOn(PermissionsAndroid, 'request').mockImplementation(() => Promise.resolve(PermissionsAndroid.RESULTS.GRANTED));

    let hookResult;
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TestHookConsumer onHookValue={(val) => { hookResult = val; }} />
      );
    });

    await ReactTestRenderer.act(async () => {
      const res = await hookResult.requestPermission();
      expect(res).toBe('granted');
    });

    expect(hookResult.status).toBe('granted');
    expect(hookResult.hasPermission).toBe(true);

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('handles NEVER_ASK_AGAIN on Android by transitioning to blocked', async () => {
    Platform.OS = 'android';
    jest.spyOn(PermissionsAndroid, 'check').mockImplementation(() => Promise.resolve(false));
    jest.spyOn(PermissionsAndroid, 'request').mockImplementation(() => Promise.resolve(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN));

    let hookResult;
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TestHookConsumer onHookValue={(val) => { hookResult = val; }} />
      );
    });

    await ReactTestRenderer.act(async () => {
      const res = await hookResult.requestPermission();
      expect(res).toBe('blocked');
    });

    expect(hookResult.status).toBe('blocked');
    expect(hookResult.hasPermission).toBe(false);

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('handles iOS camera permissions using VisionCamera', async () => {
    Platform.OS = 'ios';
    Camera.getCameraPermissionStatus.mockImplementation(() => Promise.resolve('granted'));

    let hookResult;
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TestHookConsumer onHookValue={(val) => { hookResult = val; }} />
      );
    });

    await ReactTestRenderer.act(async () => {
      const res = await hookResult.checkPermission();
      expect(res).toBe('granted');
    });

    expect(hookResult.status).toBe('granted');

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('calls Linking.openSettings when openSettings is invoked', async () => {
    jest.spyOn(Linking, 'openSettings').mockImplementation(() => Promise.resolve(true));

    let hookResult;
    let renderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TestHookConsumer onHookValue={(val) => { hookResult = val; }} />
      );
    });

    await ReactTestRenderer.act(async () => {
      await hookResult.openSettings();
    });

    expect(Linking.openSettings).toHaveBeenCalled();

    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  });

  test('renders QRScannerScreen cleanly across light and dark modes', async () => {
    const mockNav = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    for (const mode of ['light', 'dark']) {
      let renderer;
      await ReactTestRenderer.act(async () => {
        renderer = ReactTestRenderer.create(
          <ThemeProvider initialMode={mode}>
            <QRScannerScreen navigation={mockNav} />
          </ThemeProvider>
        );
      });

      expect(renderer).toBeDefined();
      await ReactTestRenderer.act(async () => {
        renderer.unmount();
      });
    }
  });

  test('triggerSafeHaptic handles vibration safely even when Vibration.vibrate throws SecurityException', () => {
    const { Vibration } = require('react-native');
    const { triggerSafeHaptic } = require('../src/utils/haptics.js');

    const vibrateSpy = jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {
      throw new Error('Neither user 10182 nor current process has android.permission.vibrate');
    });

    expect(() => {
      triggerSafeHaptic(50);
    }).not.toThrow();

    expect(vibrateSpy).toHaveBeenCalledWith(50);
    vibrateSpy.mockRestore();
  });
});
