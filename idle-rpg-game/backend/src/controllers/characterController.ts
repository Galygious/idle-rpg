import { Request, Response } from 'express';
import { Character, CharacterClass, CharacterStats, ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth';

// Mock character storage (will be replaced with database)
const characters: Character[] = [];
let nextCharacterId = 1;

// Base stats for each character class
const classBaseStats: Record<CharacterClass, CharacterStats> = {
  [CharacterClass.WARRIOR]: {
    strength: 15,
    dexterity: 10,
    intelligence: 8,
    vitality: 12,
    availablePoints: 0
  },
  [CharacterClass.MAGE]: {
    strength: 8,
    dexterity: 10,
    intelligence: 15,
    vitality: 12,
    availablePoints: 0
  },
  [CharacterClass.ROGUE]: {
    strength: 10,
    dexterity: 15,
    intelligence: 10,
    vitality: 10,
    availablePoints: 0
  },
  [CharacterClass.PALADIN]: {
    strength: 12,
    dexterity: 10,
    intelligence: 12,
    vitality: 11,
    availablePoints: 0
  },
  [CharacterClass.NECROMANCER]: {
    strength: 8,
    dexterity: 12,
    intelligence: 15,
    vitality: 10,
    availablePoints: 0
  }
};

export const createCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, class: characterClass } = req.body;

    // Check if user already has a character with this name
    const existingCharacter = characters.find(c => c.userId === userId && c.name === name);
    if (existingCharacter) {
      res.status(400).json({
        success: false,
        error: 'Character with this name already exists'
      } as ApiResponse);
      return;
    }

    // Check character limit (max 5 characters per user)
    const userCharacters = characters.filter(c => c.userId === userId);
    if (userCharacters.length >= 5) {
      res.status(400).json({
        success: false,
        error: 'Maximum character limit reached (5 characters)'
      } as ApiResponse);
      return;
    }

    // Create new character
    const newCharacter: Character = {
      id: nextCharacterId.toString(),
      userId,
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      stats: { ...classBaseStats[characterClass as CharacterClass] },
      equipment: {},
      skills: {},
      createdAt: new Date(),
      lastActive: new Date()
    };

    characters.push(newCharacter);
    nextCharacterId++;

    res.status(201).json({
      success: true,
      data: newCharacter,
      message: 'Character created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Create character error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during character creation'
    } as ApiResponse);
  }
};

export const getCharacters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const userCharacters = characters.filter(c => c.userId === userId);

    res.json({
      success: true,
      data: userCharacters,
      message: 'Characters retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const characterId = req.params.id;

    const character = characters.find(c => c.id === characterId && c.userId === userId);
    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: character,
      message: 'Character retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const characterId = req.params.id;

    const character = characters.find(c => c.id === characterId && c.userId === userId);
    if (!character) {
      res.status(404).json({
        success: false,
        error: 'Character not found'
      } as ApiResponse);
      return;
    }

    const { name, stats } = req.body;

    // Update character name if provided
    if (name && name !== character.name) {
      // Check if new name is already taken by this user
      const existingCharacter = characters.find(c => c.userId === userId && c.name === name && c.id !== characterId);
      if (existingCharacter) {
        res.status(400).json({
          success: false,
          error: 'Character name already taken'
        } as ApiResponse);
        return;
      }
      character.name = name;
    }

    // Update character stats if provided
    if (stats) {
      // Validate stat allocation
      const totalPointsUsed = (stats.strength || 0) + (stats.dexterity || 0) + 
                            (stats.intelligence || 0) + (stats.vitality || 0);
      const totalPointsAvailable = character.stats.availablePoints + 
                                 character.stats.strength + character.stats.dexterity + 
                                 character.stats.intelligence + character.stats.vitality;

      if (totalPointsUsed > totalPointsAvailable) {
        res.status(400).json({
          success: false,
          error: 'Not enough stat points available'
        } as ApiResponse);
        return;
      }

      // Update stats
      if (stats.strength !== undefined) character.stats.strength = stats.strength;
      if (stats.dexterity !== undefined) character.stats.dexterity = stats.dexterity;
      if (stats.intelligence !== undefined) character.stats.intelligence = stats.intelligence;
      if (stats.vitality !== undefined) character.stats.vitality = stats.vitality;

      // Recalculate available points
      character.stats.availablePoints = totalPointsAvailable - totalPointsUsed;
    }

    character.lastActive = new Date();

    res.json({
      success: true,
      data: character,
      message: 'Character updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteCharacter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const characterId = req.params.id;

    const characterIndex = characters.findIndex(c => c.id === characterId && c.userId === userId);
    if (characterIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Character not found'
      } as ApiResponse);
      return;
    }

    // Remove character
    characters.splice(characterIndex, 1);

    res.json({
      success: true,
      message: 'Character deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};