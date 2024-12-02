import styled, { keyframes, css } from 'styled-components'
import { useEffect, useState } from 'react'

const scorePopup = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
    color: #4ecdc4;
  }
  100% {
    transform: scale(1);
  }
`

const ScoreContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 100;
`

interface ScoreValueProps {
  $animate: boolean;
}

const ScoreValue = styled.span<ScoreValueProps>`
  display: inline-block;
  ${props => props.$animate && css`
    animation: ${scorePopup} 0.5s ease-out;
  `}
`

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 500)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <ScoreContainer>
      Score: <ScoreValue $animate={animate}>{score}</ScoreValue>
    </ScoreContainer>
  )
} 