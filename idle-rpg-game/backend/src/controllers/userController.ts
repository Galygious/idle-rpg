import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, RegisterRequest, LoginRequest, ApiResponse } from '../types';
import { generateToken } from '../middleware/auth';

// Mock user storage (will be replaced with database)
const users: User[] = [];
let nextUserId = 1;

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      } as ApiResponse);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser: User = {
      id: nextUserId.toString(),
      username,
      email,
      passwordHash,
      createdAt: new Date(),
      isVerified: false
    };

    users.push(newUser);
    nextUserId++;

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          isVerified: newUser.isVerified
        },
        token
      },
      message: 'User registered successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during registration'
    } as ApiResponse);
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
      return;
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          isVerified: user.isVerified
        },
        token
      },
      message: 'Login successful'
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during login'
    } as ApiResponse);
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      } as ApiResponse);
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      },
      message: 'Profile retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      } as ApiResponse);
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    const { username, email } = req.body;

    // Check if new username/email is already taken
    if (username && username !== user.username) {
      const existingUser = users.find(u => u.username === username && u.id !== userId);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Username already taken'
        } as ApiResponse);
        return;
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUser = users.find(u => u.email === email && u.id !== userId);
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'Email already taken'
        } as ApiResponse);
        return;
      }
      user.email = email;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      },
      message: 'Profile updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};