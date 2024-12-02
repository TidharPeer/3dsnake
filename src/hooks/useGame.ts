import { useState, useEffect, useCallback, useRef } from 'react'
import { Vector3 } from 'three'
import { Card, CARD_DECK } from '../types/CardTypes'

// Game mechanics constants
const INITIAL_SPEED = 200 // 200ms between moves
const SPEED_INCREASE = 0.9 // 10% faster (multiply by 0.9)
const MIN_APPLES_FOR_CARD = 3
const MAX_APPLES_FOR_CARD = 6

// Existing constants
const GRID_SIZE = 14
const GRID_HALF = GRID_SIZE / 2
const PLAY_BOUNDARY = 8
const INITIAL_SNAKE = [new Vector3(0, 0, 0)]
const INITIAL_DIRECTION = new Vector3(1, 0, 0)

const shuffleDeck = (cards: Card[]): Card[] => {
  const deck = [...cards]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

const generateFood = () => {
  const x = Math.floor(Math.random() * (PLAY_BOUNDARY * 2 - 1)) - (PLAY_BOUNDARY - 1)
  const z = Math.floor(Math.random() * (PLAY_BOUNDARY * 2 - 1)) - (PLAY_BOUNDARY - 1)
  return new Vector3(x, 0, z)
}

const useGame = (isActive: boolean, onScoreUpdate: (score: number) => void) => {
  const [snakePositions, setSnakePositions] = useState(INITIAL_SNAKE)
  const [foodPosition, setFoodPosition] = useState(generateFood())
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [deck, setDeck] = useState(() => shuffleDeck([...CARD_DECK]))
  const [isPaused, setIsPaused] = useState(false)
  const [extraFoodPosition, setExtraFoodPosition] = useState<Vector3 | null>(null)
  const [antActive, setAntActive] = useState(false)
  const [nextFoodIsSpecial, setNextFoodIsSpecial] = useState(false)
  
  const speedRef = useRef(INITIAL_SPEED)
  const applesUntilCardRef = useRef(Math.floor(Math.random() * (MAX_APPLES_FOR_CARD - MIN_APPLES_FOR_CARD + 1)) + MIN_APPLES_FOR_CARD)
  const applesEatenRef = useRef(0)

  const checkCollision = useCallback((position: Vector3) => {
    if (
      Math.abs(position.x) >= PLAY_BOUNDARY ||
      Math.abs(position.z) >= PLAY_BOUNDARY
    ) {
      return true
    }
    return snakePositions.slice(1).some(segment => 
      segment.x === position.x && segment.z === position.z
    )
  }, [snakePositions])

  const drawCard = useCallback(() => {
    if (deck.length === 0) {
      const newDeck = shuffleDeck([...CARD_DECK])
      setDeck(newDeck.slice(1))
      return newDeck[0]
    }
    const [drawnCard, ...remainingDeck] = deck
    setDeck(remainingDeck)
    return drawnCard
  }, [deck])

  const handleCardEffect = useCallback((card: Card) => {
    switch (card.action.type) {
      case 'GROW':
        setSnakePositions(prev => {
          const lastPos = prev[prev.length - 1]
          return [...prev, ...Array(card.action.amount).fill(lastPos)]
        })
        break
      case 'SHRINK':
        setSnakePositions(prev => 
          prev.length > card.action.amount ? 
          prev.slice(0, -card.action.amount) : 
          prev.slice(0, 1)
        )
        break
      case 'TELEPORT':
        setSnakePositions(prev => {
          const newHead = new Vector3(
            Math.floor(Math.random() * (PLAY_BOUNDARY * 2)) - PLAY_BOUNDARY,
            0,
            Math.floor(Math.random() * (PLAY_BOUNDARY * 2)) - PLAY_BOUNDARY
          )
          return [newHead, ...prev.slice(1)]
        })
        break
      case 'POINTS':
        setScore(prev => prev + card.action.amount)
        onScoreUpdate(score + card.action.amount)
        break
      case 'SPEED_BOOST':
        speedRef.current *= card.action.amount
        break
      case 'EXTRA_APPLE':
        setExtraFoodPosition(generateFood())
        break
      case 'SPAWN_ANT':
        setAntActive(true)
        break
    }
  }, [score])

  const handleCardDismissal = useCallback((event: KeyboardEvent) => {
    if (currentCard) {
      handleCardEffect(currentCard)
      setCurrentCard(null)
      event.stopPropagation()
    }
  }, [currentCard, handleCardEffect])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (currentCard) return

    switch (event.key) {
      case 'ArrowUp':
        if (direction.z !== 1) setDirection(new Vector3(0, 0, -1))
        break
      case 'ArrowDown':
        if (direction.z !== -1) setDirection(new Vector3(0, 0, 1))
        break
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection(new Vector3(-1, 0, 0))
        break
      case 'ArrowRight':
        if (direction.x !== -1) setDirection(new Vector3(1, 0, 0))
        break
      case 'p':
        setIsPaused(prev => !prev)
        break
    }
  }, [direction, currentCard])

  useEffect(() => {
    if (currentCard) {
      window.addEventListener('keydown', handleCardDismissal)
      return () => window.removeEventListener('keydown', handleCardDismissal)
    } else {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, handleCardDismissal, currentCard])

  useEffect(() => {
    if (!isActive || gameOver || isPaused || currentCard) return

    const gameLoop = setInterval(() => {
      setSnakePositions((prev) => {
        const newHead = prev[0].clone().add(direction)
        
        if (checkCollision(newHead)) {
          setGameOver(true)
          return prev
        }

        const hitMainFood = newHead.equals(foodPosition)
        const hitExtraFood = extraFoodPosition && newHead.equals(extraFoodPosition)

        if (hitMainFood || hitExtraFood) {
          if (hitMainFood) {
            setFoodPosition(generateFood())
            
            // Increment apples eaten and check for card
            applesEatenRef.current += 1
            
            // Check if this was a special apple (purple one)
            if (nextFoodIsSpecial) {
              setCurrentCard(drawCard())
              applesUntilCardRef.current = Math.floor(Math.random() * (MAX_APPLES_FOR_CARD - MIN_APPLES_FOR_CARD + 1)) + MIN_APPLES_FOR_CARD
              setNextFoodIsSpecial(false)
            }

            // Speed increase every 10 apples
            if (applesEatenRef.current % 2 === 0) {
              speedRef.current *= SPEED_INCREASE
            }
          } else if (hitExtraFood) {
            setExtraFoodPosition(null)
          }

          onScoreUpdate(score + 1)
          setScore(prev => prev + 1)
          return [newHead, ...prev]
        }

        return [newHead, ...prev.slice(0, -1)]
      })
    }, speedRef.current)

    return () => clearInterval(gameLoop)
  }, [direction, foodPosition, extraFoodPosition, gameOver, isActive, isPaused, currentCard, checkCollision, drawCard, score, nextFoodIsSpecial])

  useEffect(() => {
    const applesUntilNextCard = applesUntilCardRef.current - (applesEatenRef.current % applesUntilCardRef.current)
    setNextFoodIsSpecial(applesUntilNextCard === 1)
  }, [applesEatenRef.current])

  const handleAntCollision = useCallback(() => {
    setGameOver(true)
  }, [])

  return {
    snakePositions,
    foodPosition,
    extraFoodPosition,
    direction,
    gameOver,
    score,
    currentCard,
    isPaused,
    antActive,
    handleAntCollision,
    nextFoodIsSpecial
  }
}

export default useGame