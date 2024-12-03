import styled, { keyframes } from 'styled-components'
import { Card } from '../types/CardTypes'

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

const rippleEffect = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
`

const CardOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`

const CardContainer = styled.div`
  position: relative;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  transform-style: preserve-3d;
  animation: ${scorePopup} 0.5s ease-out;
  overflow: hidden;
  background: rgba(74, 138, 244, 0.9);
  isolation: isolate;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    background: rgba(109, 49, 255, 0.9);
    animation: ${rippleEffect} 3s ease-out infinite;
  }

  &::after {
    background: rgba(46, 213, 115, 0.9);
    animation: ${rippleEffect} 3s ease-out infinite;
    animation-delay: -1.5s;
  }
`

const RippleCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 87, 87, 0.9);
  pointer-events: none;
  animation: ${rippleEffect} 3s ease-out infinite;
  animation-delay: -0.75s;
`

const GlassOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: 15px;
  z-index: 2;
`

const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
`

const CardImage = styled.div`
  font-size: 80px;
  margin: 20px 0;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`

const CardTitle = styled.h2`
  color: white;
  font-size: 24px;
  margin: 10px 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  letter-spacing: 1px;
`

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  text-align: center;
  margin: 10px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

const ContinueText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: ${keyframes`
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  `} 1.5s ease-in-out infinite;
`

interface CardDisplayProps {
  card: Card;
}

export const CardDisplay = ({ card }: CardDisplayProps) => {
  return (
    <CardOverlay>
      <CardContainer>
        <RippleCircle />
        <GlassOverlay />
        <CardContent>
          <CardImage>{card.image}</CardImage>
          <CardTitle>{card.name}</CardTitle>
          <CardDescription>{card.description}</CardDescription>
          <ContinueText>Press any key to continue...</ContinueText>
        </CardContent>
      </CardContainer>
    </CardOverlay>
  )
} 