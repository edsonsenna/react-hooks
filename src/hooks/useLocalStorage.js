const useLocalStorage = () => {
  const readFromLS = (key = '') => {
    if (window && window.localStorage && key.length > 0)
      return JSON.parse(window.localStorage.getItem(key));
    return '';
  };

  const storeOnLS = (key = '', value = '') => {
    if (window && window.localStorage && key.length > 0 && value)
      window.localStorage.setItem(key, JSON.stringify(value));
  };

  return {
    readFromLS,
    storeOnLS,
  };
};

export default useLocalStorage;
