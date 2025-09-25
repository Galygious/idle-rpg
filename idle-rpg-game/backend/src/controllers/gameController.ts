import { Request, Response } from 'express';
import { GameState, CombatState, Monster, ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

// Mock game state storage (will be replaced with database)
const gameStates: Map<string, GameState> = new Map();
const combatStates: Map<string, CombatState> = new Map();

// Mock monster data
const monsters: Monster[] = [
  {
    id: 'goblin-1',
    name: 'Goblin Warrior',
    level: 1,
    health: 50,
    maxHealth: 50,
    damage: 8,
    defense: 2,
    attackSpeed: 1.5,
    experience: 25,
    lootTable: [
      { itemId: 'gold-coin', dropRate: 0.8, quantity: 5 },
      { itemId: 'health-potion', dropRate: 0.3, quantity: 1 }
    ]
  },
  {
    id: 'orc-1',
    name: 'Orc Berserker',
    level: 3,
    health: 120,
    maxHealth: 120,
    damage: 18,
    defense: 5,
    attackSpeed: 1.2,
    experience: 60,
    lootTable: [
      { itemId: 'gold-coin', dropRate: 0.9, quantity: 12 },
      { itemId: 'health-potion', dropRate: 0.4, quantity: 1 },
      { itemId: 'iron-sword', dropRate: 0.1, quantity: 1 }
    ]
  },
  {
    id: 'skeleton-1',
    name: 'Skeleton Archer',
    level: 2,
    health: 80,
    maxHealth: 80,
    damage: 12,
    defense: 3,
    attackSpeed: 2.0,
    experience: 40,
    lootTable: [
      { itemId: 'gold-coin', dropRate: 0.7, quantity: 8 },
      { itemId: 'mana-potion', dropRate: 0.3, quantity: 1 }
    ]
  }
];

export const getGameState = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const characterId = req.params.characterId;

    // Get or create game state
    let gameState = gameStates.get(characterId);
    if (!gameState) {
      // Create initial game state
      gameState = {
        character: {
          id: characterId,
          userId,
          name: 'New Character',
          class: 'warrior' as any,
          level: 1,
          experience: 0,
          stats: {
            strength: 10,
            dexterity: 10,
            intelligence: 10,
            vitality: 10,
            availablePoints: 0
          },
          equipment: {},
          skills: {},
          createdAt: new Date(),
          lastActive: new Date()
        },
        combat: {
          characterId,
          currentArea: 'starting-area',
          isActive: false,
          startTime: new Date(),
          lastUpdate: new Date(),
          totalDamageDealt: 0,
          totalDamageReceived: 0,
          monstersKilled: 0,
          experienceGained: 0
        },
        inventory: [],
        currencies: [
          { type: 'gold', amount: 100 }
        ],
        achievements: [],
        settings: {
          combatSpeed: 1,
          autoAdvance: false,
          autoLoot: false,
          autoSell: false,
          notifications: true,
          soundEnabled: true,
          musicEnabled: true
        }
      };
      gameStates.set(characterId, gameState);
    }

    res.json({
      success: true,
      data: gameState,
      message: 'Game state retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Get game state error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const performGameAction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const characterId = req.params.characterId;
    const { action, data } = req.body;

    const gameState = gameStates.get(characterId);
    if (!gameState) {
      res.status(404).json({
        success: false,
        error: 'Game state not found'
      } as ApiResponse);
      return;
    }

    let result: any = {};

    switch (action) {
      case 'startCombat':
        result = await startCombat(gameState, data);
        break;
      case 'stopCombat':
        result = await stopCombat(gameState);
        break;
      case 'equipItem':
        result = await equipItem(gameState, data);
        break;
      case 'useItem':
        result = await useItem(gameState, data);
        break;
      case 'levelUp':
        result = await levelUp(gameState, data);
        break;
      default:
        res.status(400).json({
          success: false,
          error: 'Invalid action'
        } as ApiResponse);
        return;
    }

    // Update game state
    gameStates.set(characterId, gameState);

    res.json({
      success: true,
      data: result,
      message: `Action '${action}' performed successfully`
    } as ApiResponse);
  } catch (error) {
    console.error('Game action error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

// Helper functions for game actions
async function startCombat(gameState: GameState, data: any) {
  if (gameState.combat.isActive) {
    throw new Error('Combat is already active');
  }

  // Select a random monster based on character level
  const availableMonsters = monsters.filter(m => m.level <= gameState.character.level + 2);
  const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];

  gameState.combat = {
    characterId: gameState.character.id,
    currentArea: data.area || 'starting-area',
    currentMonster: { ...randomMonster },
    isActive: true,
    startTime: new Date(),
    lastUpdate: new Date(),
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    monstersKilled: 0,
    experienceGained: 0
  };

  return {
    combatStarted: true,
    monster: gameState.combat.currentMonster
  };
}

async function stopCombat(gameState: GameState) {
  if (!gameState.combat.isActive) {
    throw new Error('Combat is not active');
  }

  gameState.combat.isActive = false;
  gameState.combat.currentMonster = undefined;

  return {
    combatStopped: true,
    stats: {
      totalDamageDealt: gameState.combat.totalDamageDealt,
      totalDamageReceived: gameState.combat.totalDamageReceived,
      monstersKilled: gameState.combat.monstersKilled,
      experienceGained: gameState.combat.experienceGained
    }
  };
}

async function equipItem(gameState: GameState, data: any) {
  const { itemId, slot } = data;
  
  // Find item in inventory
  const inventoryItem = gameState.inventory.find(item => item.item.id === itemId);
  if (!inventoryItem) {
    throw new Error('Item not found in inventory');
  }

  // Check if slot is valid
  const validSlots = ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'belt', 'ring1', 'ring2', 'amulet', 'shield'];
  if (!validSlots.includes(slot)) {
    throw new Error('Invalid equipment slot');
  }

  // Unequip current item in slot if any
  const currentItemId = gameState.character.equipment[slot as keyof typeof gameState.character.equipment];
  if (currentItemId) {
    const currentItem = gameState.inventory.find(item => item.item.id === currentItemId);
    if (currentItem) {
      currentItem.position = gameState.inventory.length;
    }
  }

  // Equip new item
  gameState.character.equipment[slot as keyof typeof gameState.character.equipment] = itemId;
  inventoryItem.position = undefined; // Remove from inventory

  return {
    itemEquipped: true,
    slot,
    item: inventoryItem.item
  };
}

async function useItem(gameState: GameState, data: any) {
  const { itemId } = data;
  
  const inventoryItem = gameState.inventory.find(item => item.item.id === itemId);
  if (!inventoryItem) {
    throw new Error('Item not found in inventory');
  }

  // Handle different item types
  if (inventoryItem.item.type === 'consumable') {
    // Apply item effects (healing, mana, etc.)
    inventoryItem.quantity -= 1;
    
    if (inventoryItem.quantity <= 0) {
      // Remove item from inventory
      const index = gameState.inventory.indexOf(inventoryItem);
      gameState.inventory.splice(index, 1);
    }

    return {
      itemUsed: true,
      effects: 'Item effects applied'
    };
  }

  throw new Error('Item cannot be used');
}

async function levelUp(gameState: GameState, data: any) {
  const { stat } = data;
  
  if (gameState.character.stats.availablePoints <= 0) {
    throw new Error('No stat points available');
  }

  if (!['strength', 'dexterity', 'intelligence', 'vitality'].includes(stat)) {
    throw new Error('Invalid stat');
  }

  gameState.character.stats[stat as keyof typeof gameState.character.stats] += 1;
  gameState.character.stats.availablePoints -= 1;

  return {
    levelUp: true,
    stat,
    newValue: gameState.character.stats[stat as keyof typeof gameState.character.stats],
    remainingPoints: gameState.character.stats.availablePoints
  };
}