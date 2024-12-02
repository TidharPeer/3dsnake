import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Game from './components/Game'
import { GameUI } from './components/GameUI'
import { CardDisplay } from './components/CardDisplay'
import styled from 'styled-components'
import { useState } from 'react'
import { ScoreDisplay } from './components/ScoreDisplay'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96c93d);
  animation: gradientBG 15s ease infinite;

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameover'>('start')
  const [score, setScore] = useState(0)
  const [key, setKey] = useState(0)
  const [currentCard, setCurrentCard] = useState(null)

  const handleStart = () => setGameState('playing')
  const handleResume = () => setGameState('playing')
  const handleRestart = () => {
    setScore(0)
    setGameState('playing')
    setKey(prevKey => prevKey + 1)
  }

  return (
    <Container>
      <ScoreDisplay score={score} />
      <Canvas key={key} camera={{ position: [0, 30, 15], fov: 40 }}>
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={30}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />
        <Game 
          gameState={gameState}
          setGameState={setGameState}
          score={score}
          setScore={setScore}
          setCurrentCard={setCurrentCard}
        />
      </Canvas>
      <GameUI 
        gameState={gameState}
        score={score}
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
      />
      {currentCard && <CardDisplay card={currentCard} />}
    </Container>
  )
}

export default App
