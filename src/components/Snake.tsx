import { Vector3 } from 'three'
import { Sphere } from '@react-three/drei'

interface SnakeProps {
  positions: Vector3[]
  direction: Vector3
}

export const Snake = ({ positions, direction }: SnakeProps) => {
  // Updated rotation angles to face the correct direction
  const getHeadRotation = (): [number, number, number] => {
    if (direction.x === 1) return [0, Math.PI / 2, 0]    // Right
    if (direction.x === -1) return [0, -Math.PI / 2, 0]  // Left
    if (direction.z === 1) return [0, 0, 0]              // Down
    if (direction.z === -1) return [0, Math.PI, 0]       // Up
    return [0, 0, 0]
  }

  return (
    <group>
      {/* Head */}
      <group position={positions[0]} rotation={getHeadRotation()}>
        <mesh>
          <Sphere args={[0.5, 16, 16]}>
            <meshStandardMaterial
              color="#50C878"
              roughness={0.3}
              metalness={0.5}
            />
          </Sphere>
          {/* Eyes */}
          <group position={[0.25, 0.25, 0.35]}>
            <Sphere args={[0.12, 8, 8]}>
              <meshStandardMaterial color="white" />
            </Sphere>
            <Sphere args={[0.06, 8, 8]} position={[0, 0, 0.06]}>
              <meshStandardMaterial color="black" />
            </Sphere>
          </group>
          <group position={[-0.25, 0.25, 0.35]}>
            <Sphere args={[0.12, 8, 8]}>
              <meshStandardMaterial color="white" />
            </Sphere>
            <Sphere args={[0.06, 8, 8]} position={[0, 0, 0.06]}>
              <meshStandardMaterial color="black" />
            </Sphere>
          </group>
        </mesh>
      </group>

      {/* Body segments */}
      {positions.slice(1).map((pos, index) => (
        <mesh key={index} position={pos}>
          <Sphere args={[0.45, 16, 16]}>
            <meshStandardMaterial
              color={`hsl(145, 80%, ${45 + (index * 2)}%)`}
              roughness={0.3}
              metalness={0.3}
            />
          </Sphere>
        </mesh>
      ))}
    </group>
  )
}
