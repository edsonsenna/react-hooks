// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const LS_NAME_KEY = 'react-hook-name';

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName

  const {readFromLS, storeOnLS} = useLocalStorageState();

  const [name, setName] = React.useState(
    () => readFromLS(LS_NAME_KEY) ?? initialName,
  );

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  React.useEffect(() => {
    storeOnLS(LS_NAME_KEY, name);
  }, [name, storeOnLS]);

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
