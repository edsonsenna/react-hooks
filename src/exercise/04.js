// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import useLocalStorageState from '../hooks/useLocalStorageState';

const initialHistory = [Array(9).fill(null)];

function Board({currentSquares, onSquareClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareClick(i)}>
        {currentSquares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const [historyOnLS, setHistoryOnLS] = useLocalStorageState(
    'current-game',
    JSON.stringify(initialHistory),
  );

  const [history, setHistory] = React.useState(
    () => JSON.parse(historyOnLS) || initialHistory,
  );
  const [currentStep, setCurrentStep] = React.useState(0);
  const [currentSquares, setCurrentSquares] = React.useState([]);

  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  const moves = history.map((_, index) => (
    <li key={`move-${index}`}>
      <button
        disabled={index === currentStep}
        onClick={() => onMoveSelect(index)}
      >
        {index === 0 ? 'Go to game start' : `Go to move #${index}`}
        {index === currentStep ? ' (current)' : ''}
      </button>
    </li>
  ));

  React.useEffect(() => {
    setHistoryOnLS(JSON.stringify(history));
  }, [history, setHistoryOnLS]);

  React.useEffect(() => {
    if (history.length > 0) {
      setCurrentSquares(history[currentStep] || []);
    }
  }, [history, currentStep]);

  function restart() {
    setCurrentStep(0);
    setHistory(initialHistory);
  }

  function onMoveSelect(index) {
    setHistory([
      ...history.map((historyItem, historyIndex) =>
        historyIndex === currentStep ? history[index] : historyItem,
      ),
    ]);
    setCurrentStep(index);
  }

  function onSquareClick(squareIndex) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || currentSquares[squareIndex]) return;
    //
    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 make a copy of the squares array
    // 💰 `[...squares]` will do it!)
    //
    // 🐨 set the value of the square that was selected
    // 💰 `squaresCopy[square] = nextValue`
    //
    // 🐨 set the squares to your copy
    const updatedSquares = currentSquares.map((square, index) =>
      index === squareIndex ? nextValue : square,
    );

    const updatedHistory = [
      ...history.slice(0, currentStep + 1),
      updatedSquares,
    ];
    setCurrentStep(updatedHistory.length - 1);
    setHistory(updatedHistory);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board currentSquares={currentSquares} onSquareClick={onSquareClick} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
