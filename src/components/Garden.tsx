import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'
import * as THREE from 'three'

const Flower = ({ position, color, scale = 1, rotationOffset = 0 }) => {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      // Swaying animation
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime + rotationOffset) * 0.1
      ref.current.rotation.z = Math.cos(state.clock.elapsedTime + rotationOffset) * 0.1
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Stem */}
      <Instance position={[0, 0.4, 0]} scale={[0.05, 0.8, 0.05]} color="#2D5A27" />
      
      {/* Petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <group key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
          <Instance
            position={[0, 0.9, 0]}
            scale={[0.15, 0.3, 0.05]}
            rotation={[0, 0, -0.5]}
            color={color}
          />
        </group>
      ))}
      
      {/* Center */}
      <Instance position={[0, 0.9, 0]} scale={[0.15, 0.15, 0.05]} color="#FFD700" />
    </group>
  )
}

const Grass = ({ position, scale = 1, rotationOffset = 0 }) => {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime + rotationOffset) * 0.1
      ref.current.rotation.z = Math.cos(state.clock.elapsedTime + rotationOffset) * 0.1
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <Instance position={[0, 0.2, 0]} scale={[0.03, 0.4, 0.03]} color="#3A7D44" />
    </group>
  )
}

export const Garden = () => {
  const flowerColors = [
    '#FF69B4', // Pink
    '#FF6B6B', // Red
    '#4ECDC4', // Turquoise
    '#9B59B6', // Purple
    '#F1C40F', // Yellow
  ]

  return (
    <group position={[0, -0.5, 0]}>
      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#90AF74" />
      </mesh>

      <Instances limit={500}>
        <boxGeometry />
        <meshStandardMaterial />
        
        {/* Flowers */}
        {Array.from({ length: 100 }).map((_, i) => {
          const x = Math.random() * 40 - 20
          const z = Math.random() * 40 - 20
          // Don't place flowers in the play area
          if (Math.abs(x) < 10 && Math.abs(z) < 10) return null
          
          return (
            <Flower
              key={`flower-${i}`}
              position={[x, 0, z]}
              color={flowerColors[Math.floor(Math.random() * flowerColors.length)]}
              scale={0.7 + Math.random() * 0.6}
              rotationOffset={Math.random() * Math.PI * 2}
            />
          )
        })}

        {/* Grass */}
        {Array.from({ length: 300 }).map((_, i) => {
          const x = Math.random() * 40 - 20
          const z = Math.random() * 40 - 20
          // Don't place grass in the play area
          if (Math.abs(x) < 10 && Math.abs(z) < 10) return null
          
          return (
            <Grass
              key={`grass-${i}`}
              position={[x, 0, z]}
              scale={0.8 + Math.random() * 0.4}
              rotationOffset={Math.random() * Math.PI * 2}
            />
          )
        })}
      </Instances>
    </group>
  )
} 