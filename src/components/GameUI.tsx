import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
`

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  font-size: 18px;
  background: #4ecdc4;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #45b7d1;
  }
`

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 20px;
  color: #4ecdc4;
`

const Score = styled.p`
  font-size: 24px;
  margin-bottom: 20px;
`

interface GameUIProps {
  gameState: 'start' | 'playing' | 'paused' | 'gameover';
  score: number;
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const GameUI = ({ gameState, score, onStart, onResume, onRestart }: GameUIProps) => {
  if (gameState === 'playing') return null;

  return (
    <Overlay>
      {gameState === 'start' && (
        <>
          <Title>3D Snake Game</Title>
          <p>Use arrow keys to move the snake</p>
          <p>Press P to pause the game</p>
          <Button onClick={onStart}>Start Game</Button>
        </>
      )}

      {gameState === 'paused' && (
        <>
          <Title>Game Paused</Title>
          <Score>Score: {score}</Score>
          <Button onClick={onResume}>Resume Game</Button>
        </>
      )}

      {gameState === 'gameover' && (
        <>
          <Title>Game Over!</Title>
          <Score>Final Score: {score}</Score>
          <Button onClick={onRestart}>Play Again</Button>
        </>
      )}
    </Overlay>
  )
}

export default GameUI;
