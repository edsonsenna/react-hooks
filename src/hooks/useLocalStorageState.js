import React, {useRef} from 'react';
import useLocalStorage from './useLocalStorage';

const useLocalStorageState = (
  key,
  defaultValue = '',
  {deserialize = JSON.parse, serialize = JSON.stringify} = {},
) => {
  const {readFromLS, removeFromLS, storeOnLS} = useLocalStorage({
    deserialize,
    serialize,
  });

  const prevKeyRef = useRef(key);

  const [state, setState] = React.useState(
    () => readFromLS(key) ?? defaultValue,
  );

  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      removeFromLS(prevKey);
    }
    prevKeyRef.current = key;
    storeOnLS(key, state);
  }, [key, removeFromLS, state, storeOnLS]);

  return [state, setState];
};

export default useLocalStorageState;
