// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react';
import PropTypes from 'prop-types';

function Greeting(props) {
  const {initialName = 'World'} = props;

  const [name, setName] = React.useState(initialName);

  function handleChange(event) {
    setName(event.currentTarget.value);
    // 🐨 update the name here based on event.target.value
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name.length > 0 ? (
        <strong>Hello {name}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  );
}

Greeting.propTypes = {
  initialName: PropTypes.string,
};

function App() {
  return <Greeting initialName="Senna" />;
}

export default App;
