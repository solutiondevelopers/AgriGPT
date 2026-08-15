import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import { initializeDefaultSettings } from './settingsController.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agrigpt-super-secret-key-development-only';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'agrigpt-refresh-secret-development-only';

// Helper function to generate tokens
const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId, role }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email } as any);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'farmer'
    });

    await newUser.save();

    // Initialize default settings for the new user
    await initializeDefaultSettings(newUser._id.toString());

    const { accessToken, refreshToken } = generateTokens(newUser._id.toString(), newUser.role);

    const userObj = newUser.toObject();
    delete (userObj as any).password;

    res.status(201).json({ 
      user: { id: userObj._id, ...userObj }, 
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email } as any);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ 
      user: { id: userObj._id, ...userObj }, 
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally generate new refresh token (rotate for better security)
    const newRefreshToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ error: 'Invalid token format. Please log in again.' });
    }

    const user = await (User.findById as any)(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    delete (userObj as any).password;
    
    res.json({ user: { id: userObj._id, ...userObj } });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
