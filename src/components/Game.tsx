import { useEffect } from 'react'
import { Snake } from './Snake'
import { Food } from './Food'
import { Grid } from './Grid'
import { Ant } from './Ant'
import useGame from '../hooks/useGame'

interface GameProps {
  gameState: 'start' | 'playing' | 'paused' | 'gameover';
  setGameState: (state: 'start' | 'playing' | 'paused' | 'gameover') => void;
  setScore: (score: number) => void;
  setCurrentCard: (card: any) => void;
}

const Game = ({ gameState, setGameState, setScore, setCurrentCard }: GameProps) => {
  const { 
    snakePositions, 
    foodPosition,
    extraFoodPosition, 
    direction, 
    gameOver, 
    currentCard,
    isPaused,
    antActive,
    handleAntCollision,
    nextFoodIsSpecial
  } = useGame(
    gameState === 'playing',
    (newScore) => setScore(newScore)
  )

  useEffect(() => {
    if (gameOver) {
      setGameState('gameover')
    }
  }, [gameOver])

  useEffect(() => {
    if (isPaused && gameState === 'playing') {
      setGameState('paused')
    }
  }, [isPaused])

  useEffect(() => {
    setCurrentCard(currentCard)
  }, [currentCard])

  return (
    <>
      <Grid />
      <Snake positions={snakePositions} direction={direction} />
      <Food position={foodPosition} isSpecial={nextFoodIsSpecial} />
      {extraFoodPosition && <Food position={extraFoodPosition} />}
      {antActive && (
        <Ant 
          onCollisionWithSnake={handleAntCollision}
          snakePositions={snakePositions}
          playBoundary={8}
        />
      )}
    </>
  )
}

export default Game
