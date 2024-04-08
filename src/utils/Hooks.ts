import {useEffect, useState, useCallback, useRef} from 'react';

type MultiState<T> = [
  T,
  (
    newStateOrCb: Partial<T> | ((currentState: T) => Partial<T>),
    callback?: () => void,
  ) => void,
  {[K in keyof T]: (newValue: T[K]) => void},
];

export const getGeneralCase = (text: string) => {
  const rg = /(^\w{1}|\.\s*\w{1})/gi;
  text = text.replace(rg, toReplace => toReplace.toUpperCase());
  return text;
};

export function useMultiState<T extends Record<string, unknown>>(
  initialState: T,
): MultiState<T> {
  const callbackRef = useRef<((state: T) => void) | null>(null);
  const [state, setState] = useState<T>(initialState);

  const batchedSetState = (newState: Partial<T>) => {
    setState(prevState => ({...prevState, ...newState}));
  };

  const setters = Object.entries(initialState).reduce((acc, [prop, value]) => {
    const propName = `set${getGeneralCase(prop)}`;
    acc[propName as keyof T] = (newValue: T[keyof T]) => {
      batchedSetState({[prop]: newValue} as Partial<T>);
    };
    return acc;
  }, {} as {[K in keyof T]: (newValue: T[K]) => void});

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = null;
    }
  }, [state]);

  return [
    state,
    (newStateOrCb, callback) => {
      const newState =
        typeof newStateOrCb === 'function'
          ? (newStateOrCb as (currentState: T) => Partial<T>)(state)
          : (newStateOrCb as Partial<T>);

      for (const prop in newState) {
        batchedSetState({[prop]: newState[prop]} as Partial<T>);
      }

      if (callback && typeof callback === 'function') {
        callbackRef.current = callback;
      }
    },
    setters,
  ];
}
