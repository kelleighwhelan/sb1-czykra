import React from 'react';
import useStore from './store';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';

function App() {
  const isGameStarted = useStore((state) => state.isGameStarted);

  return isGameStarted ? <GameScreen /> : <WelcomeScreen />;
}

export default App;