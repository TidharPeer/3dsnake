export const Grid = () => {
  return (
    <group>
      {/* Border/frame (dark) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Main playable grid (lighter) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[16, 16]} /> {/* Match PLAY_BOUNDARY * 2 */}
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  )
}
