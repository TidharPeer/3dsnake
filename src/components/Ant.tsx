import { useRef } from 'react'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AntProps {
  onCollisionWithSnake: () => void
  snakePositions: Vector3[]
  playBoundary: number
}

export const Ant = ({ onCollisionWithSnake, snakePositions, playBoundary }: AntProps) => {
  const antPosition = useRef(new Vector3(
    Math.floor(Math.random() * (playBoundary * 2)) - playBoundary,
    0,
    Math.floor(Math.random() * (playBoundary * 2)) - playBoundary
  ))
  
  const direction = useRef(new Vector3(
    Math.random() > 0.5 ? 1 : -1,
    0,
    Math.random() > 0.5 ? 1 : -1
  ))

  const antRef = useRef<THREE.Group>(null)
  const moveTimer = useRef<number>(0)
  const MOVE_INTERVAL = 300

  const checkCollisionWithSnake = (position: Vector3) => {
    if (position.equals(snakePositions[0])) {
      onCollisionWithSnake()
      return true
    }
    return snakePositions.slice(1).some(segment => 
      segment.x === position.x && segment.z === position.z
    )
  }

  const getNewDirection = () => {
    const possibleDirections = [
      new Vector3(1, 0, 0),
      new Vector3(-1, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 0, -1)
    ]

    const validDirections = possibleDirections.filter(dir => {
      const newPos = antPosition.current.clone().add(dir)
      return !checkCollisionWithSnake(newPos) && 
             Math.abs(newPos.x) < playBoundary &&
             Math.abs(newPos.z) < playBoundary
    })

    if (validDirections.length === 0) return direction.current
    return validDirections[Math.floor(Math.random() * validDirections.length)]
  }

  useFrame((_, delta) => {
    moveTimer.current += delta * 1000

    if (moveTimer.current >= MOVE_INTERVAL) {
      moveTimer.current = 0

      const newPosition = antPosition.current.clone().add(direction.current)

      if (
        Math.abs(newPosition.x) >= playBoundary ||
        Math.abs(newPosition.z) >= playBoundary ||
        checkCollisionWithSnake(newPosition)
      ) {
        direction.current = getNewDirection()
        return
      }

      antPosition.current = newPosition

      if (Math.random() < 0.1) {
        direction.current = getNewDirection()
      }
    }

    // Update ant rotation to face movement direction
    if (antRef.current) {
      const angle = Math.atan2(direction.current.x, direction.current.z)
      antRef.current.rotation.y = angle
    }
  })

  return (
    <group ref={antRef} position={antPosition.current}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 8, 8]} />
        <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.25, 0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.06, 0.3, 0.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[-0.06, 0.3, 0.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#000000" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Legs (3 pairs) */}
      {[0.15, 0, -0.15].map((z, i) => (
        <group key={i} position={[0, 0.1, z]}>
          {/* Left leg */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.02, 0.2, 4, 4]} />
            <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Right leg */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <capsuleGeometry args={[0.02, 0.2, 4, 4]} />
            <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Antennae */}
      <mesh position={[0.08, 0.35, 0.25]} rotation={[Math.PI / 4, 0.2, 0]}>
        <capsuleGeometry args={[0.01, 0.15, 4, 4]} />
        <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[-0.08, 0.35, 0.25]} rotation={[Math.PI / 4, -0.2, 0]}>
        <capsuleGeometry args={[0.01, 0.15, 4, 4]} />
        <meshStandardMaterial color="#4A0404" roughness={0.7} metalness={0.3} />
      </mesh>
    </group>
  )
} 