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

function PokemonInfo({pokemonName}) {
  const [error, setError] = React.useState(null);
  const [computedState, setComputedState] = React.useState({
    status: Statuses.idle,
    pokemon: null,
  });

  React.useEffect(() => {
    const fetchPokemonData = async () => {
      if (!pokemonName) return;

      setComputedState({status: Statuses.pending, pokemon: null});
      setError(null);

      return fetchPokemon(pokemonName).then(
        pokemonData => {
          setComputedState({status: Statuses.resolved, pokemon: pokemonData});
        },
        error => {
          setError(error);
          setComputedState(oldComputedState => ({
            ...oldComputedState,
            status: Statuses.rejected,
          }));
        },
      );
    };
    fetchPokemonData();
  }, [pokemonName]);

  if (computedState.status === Statuses.idle) {
    return 'Submit a pokemon';
  } else if (computedState.status === Statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (computedState.status === Statuses.rejected) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    );
  } else if (computedState.status === Statuses.resolved) {
    return <PokemonDataView pokemon={computedState.pokemon} />;
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  );
}

export default App;
