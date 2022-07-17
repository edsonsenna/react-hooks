const useLocalStorage = ({
  deserialize = JSON.parse,
  serialize = JSON.stringify,
} = {}) => {
  const removeFromLS = (key = '') => {
    if (window && window.localStorage && key.length > 0)
      window.localStorage.removeItem(key);
  };
  const readFromLS = (key = '') => {
    if (window && window.localStorage && key.length > 0)
      return deserialize(window.localStorage.getItem(key));
    return '';
  };

  const storeOnLS = (key = '', value = '') => {
    if (window && window.localStorage && key.length > 0 && value)
      window.localStorage.setItem(key, serialize(value));
  };

  return {
    readFromLS,
    removeFromLS,
    storeOnLS,
  };
};

export default useLocalStorage;
