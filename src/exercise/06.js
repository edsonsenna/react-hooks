// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';

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
    throw error;
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

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

const FallbackComponent = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default App;
