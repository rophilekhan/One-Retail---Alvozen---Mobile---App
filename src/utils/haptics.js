import { Vibration } from 'react-native';

/**
 * Crash-Proof Cross-Device Haptic / Vibration Helper
 *
 * Safely triggers vibration feedback across all Android, iOS devices, tablets, and emulators.
 * Wraps Vibration.vibrate() in a strict try-catch block so missing permissions,
 * devices without vibrators, or un-rebuilt native apps NEVER trigger a Red Screen error.
 *
 * @param {number} [duration=50] - Vibration duration in milliseconds (default: 50ms)
 */
export const triggerSafeHaptic = (duration = 50) => {
  try {
    if (typeof Vibration !== 'undefined' && typeof Vibration.vibrate === 'function') {
      Vibration.vibrate(duration);
    }
  } catch (_err) {
    // Silently ignore on devices/emulators without vibrator or before native rebuild
  }
};

export default triggerSafeHaptic;
