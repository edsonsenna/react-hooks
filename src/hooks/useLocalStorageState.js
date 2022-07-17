import React from 'react';
import useLocalStorage from './useLocalStorage';

const useLocalStorageState = (key, defaultValue = '') => {
  const {readFromLS, storeOnLS} = useLocalStorage();

  const [state, setState] = React.useState(
    () => readFromLS(key) ?? defaultValue,
  );

  React.useEffect(() => {
    storeOnLS(key, state);
  }, [key, state, storeOnLS]);

  return [state, setState];
};

export default useLocalStorageState;
