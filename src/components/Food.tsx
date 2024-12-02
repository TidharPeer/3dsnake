import { useRef } from 'react'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

interface FoodProps {
  position: Vector3;
  isSpecial?: boolean;
}

export const Food = ({ position, isSpecial = false }: FoodProps) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <group position={position}>
      <Sphere ref={ref} args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color={isSpecial ? '#9b4dca' : '#ff0000'}
          roughness={0.3}
          metalness={0.7}
          emissive={isSpecial ? '#9b4dca' : '#ff0000'}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  )
}
