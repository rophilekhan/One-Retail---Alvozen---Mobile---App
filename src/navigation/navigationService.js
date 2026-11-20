import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Navigate to a route without needing navigation prop
 */
export const navigate = (name, params) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

/**
 * Go back one screen
 */
export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

/**
 * Reset navigation back to the authentication stack
 */
export const resetToAuth = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  }
};

/**
 * Reset navigation to the main tabs dashboard
 */
export const resetToMain = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  }
};

export default {
  navigationRef,
  navigate,
  goBack,
  resetToAuth,
  resetToMain,
};
