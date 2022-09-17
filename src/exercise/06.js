// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon';

const Statuses = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const WRONG_POKEMON_ERROR = 'wrong-pokemon-name';

function PokemonInfo({pokemonName}) {
  const [computedState, setComputedState] = React.useState({
    status: Statuses.idle,
    pokemon: null,
    error: null,
  });

  const {status, pokemon, error} = computedState;

  React.useEffect(() => {
    const fetchPokemonData = async () => {
      if (!pokemonName) return;

      setComputedState({status: Statuses.pending, pokemon: null, error: null});
      return fetchPokemon(pokemonName).then(
        pokemonData => {
          setComputedState(oldComputedState => ({
            ...oldComputedState,
            status: Statuses.resolved,
            pokemon: pokemonData,
          }));
        },
        error => {
          setComputedState(oldComputedState => ({
            ...oldComputedState,
            status: Statuses.rejected,
            error,
          }));
        },
      );
    };
    fetchPokemonData();
  }, [pokemonName]);

  if (status === Statuses.idle) {
    return 'Submit a pokemon';
  } else if (status === Statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === Statuses.rejected) {
    throw new Error(error.message);
  } else if (status === Statuses.resolved) {
    return <PokemonDataView pokemon={pokemon} />;
  }

  throw new Error('This should be impossible.');
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, errorMessage: ''};
  }

  static getDerivedStateFromError(error) {
    console.log('Caught error: ', error.message);

    // Update state so the next render will show the fallback UI.
    return {hasError: true, errorMessage: error.message || ''};
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI

      if (this.state.errorMessage.length > 0) {
        return (
          <div role="alert">
            There was an error:{' '}
            <pre style={{whiteSpace: 'normal'}}>{this.state.errorMessage}</pre>
          </div>
        );
      }

      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default App;
