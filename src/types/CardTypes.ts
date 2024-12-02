export type CardAction = 
  | { type: 'GROW', amount: number }
  | { type: 'SHRINK', amount: number }
  | { type: 'TELEPORT' }
  | { type: 'POINTS', amount: number }
  | { type: 'SPEED_BOOST', amount: number }
  | { type: 'EXTRA_APPLE' }
  | { type: 'SPAWN_ANT' }

export interface Card {
  id: number;
  name: string;
  description: string;
  action: CardAction;
  image: string;
}

export const CARD_DECK: Card[] = [
  {
    id: 1,
    name: "Growth Spurt",
    description: "Your snake grows longer!",
    action: { type: 'GROW', amount: 3 },
    image: "🌱"
  },
  {
    id: 2,
    name: "Shrinking Potion",
    description: "Your snake becomes shorter!",
    action: { type: 'SHRINK', amount: 3 },
    image: "⚗️"
  },
  {
    id: 3,
    name: "Teleportation Scroll",
    description: "Teleport to a random location!",
    action: { type: 'TELEPORT' },
    image: "🌀"
  },
  {
    id: 4,
    name: "Treasure Chest",
    description: "Gain 10 bonus points!",
    action: { type: 'POINTS', amount: 10 },
    image: "💎"
  },
  {
    id: 5,
    name: "Speed Potion",
    description: "Move 20% faster!",
    action: { type: 'SPEED_BOOST', amount: 0.8 }, // 0.8 represents 20% faster
    image: "⚡"
  },
  {
    id: 6,
    name: "Apple Spell",
    description: "Spawn an extra apple!",
    action: { type: 'EXTRA_APPLE' },
    image: "🍎"
  },
  {
    id: 7,
    name: "Ant Curse",
    description: "Watch out for the deadly ant!",
    action: { type: 'SPAWN_ANT' },
    image: "🐜"
  }
]
