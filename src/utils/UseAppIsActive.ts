// hooks/useAppIsActive.ts

import {useCallback, useEffect, useRef} from 'react';
import {AppState} from 'react-native';

export default (callback: Function) => {
  const appStateRef = useRef(AppState.currentState);
  const handleAppStateChange = useCallback(nextAppState => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      callback();
    }

    appStateRef.current = nextAppState;
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);
};
