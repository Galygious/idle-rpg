// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Character Types
export interface Character {
  id: string;
  userId: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: CharacterStats;
  equipment: CharacterEquipment;
  skills: CharacterSkills;
  createdAt: Date;
  lastActive: Date;
}

export enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  ROGUE = 'rogue',
  PALADIN = 'paladin',
  NECROMANCER = 'necromancer'
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
  availablePoints: number;
}

export interface CharacterEquipment {
  weapon?: string;
  armor?: string;
  helmet?: string;
  boots?: string;
  gloves?: string;
  belt?: string;
  ring1?: string;
  ring2?: string;
  amulet?: string;
  shield?: string;
}

export interface CharacterSkills {
  [skillId: string]: {
    level: number;
    experience: number;
    unlocked: boolean;
  };
}

// Item Types
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  level: number;
  stats: ItemStats;
  affixes: ItemAffix[];
  durability: number;
  maxDurability: number;
  requirements: ItemRequirements;
  description: string;
  flavorText?: string;
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  HELMET = 'helmet',
  BOOTS = 'boots',
  GLOVES = 'gloves',
  BELT = 'belt',
  RING = 'ring',
  AMULET = 'amulet',
  SHIELD = 'shield',
  CONSUMABLE = 'consumable'
}

export enum ItemRarity {
  COMMON = 'common',
  MAGIC = 'magic',
  RARE = 'rare',
  SET = 'set',
  UNIQUE = 'unique'
}

export interface ItemStats {
  damage?: number;
  armor?: number;
  health?: number;
  mana?: number;
  attackSpeed?: number;
  criticalChance?: number;
  criticalDamage?: number;
  elementalResistance?: number;
}

export interface ItemAffix {
  id: string;
  name: string;
  type: 'prefix' | 'suffix';
  tier: number;
  value: number;
  statType: string;
}

export interface ItemRequirements {
  level: number;
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  vitality?: number;
  class?: CharacterClass[];
}

// Combat Types
export interface CombatState {
  characterId: string;
  currentArea: string;
  currentMonster?: Monster;
  isActive: boolean;
  startTime: Date;
  lastUpdate: Date;
  totalDamageDealt: number;
  totalDamageReceived: number;
  monstersKilled: number;
  experienceGained: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  damage: number;
  defense: number;
  attackSpeed: number;
  experience: number;
  lootTable: LootEntry[];
  abilities?: MonsterAbility[];
}

export interface MonsterAbility {
  name: string;
  damage: number;
  cooldown: number;
  effects?: StatusEffect[];
}

export interface LootEntry {
  itemId: string;
  dropRate: number;
  quantity: number;
  minLevel?: number;
  maxLevel?: number;
}

export interface StatusEffect {
  type: string;
  duration: number;
  value: number;
  isDebuff: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Game State Types
export interface GameState {
  character: Character;
  combat: CombatState;
  inventory: InventoryItem[];
  currencies: CurrencyAmount[];
  achievements: Achievement[];
  settings: GameSettings;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
  position?: number;
}

export interface CurrencyAmount {
  type: string;
  amount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface GameSettings {
  combatSpeed: number;
  autoAdvance: boolean;
  autoLoot: boolean;
  autoSell: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
}