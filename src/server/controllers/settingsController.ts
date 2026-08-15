import { Request, Response } from 'express';
import { UserSettings } from '../models/UserSettings.js';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user from auth middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-change-in-production';

/**
 * Get all settings for the current user
 */
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let settings = await UserSettings.findOne({ userId: req.user.id } as any);
    
    // If no settings exist, create default settings for this user
    if (!settings) {
      settings = new UserSettings({
        userId: req.user.id
      });
      await settings.save();
    }

    res.json({ settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

/**
 * Update a specific settings section
 */
export const updateSettingsSection = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { section } = req.params;
    const sectionData = req.body;

    // Validate section name
    const validSections = [
      'profile', 'aiPreferences', 'language', 'voice', 'notifications',
      'privacy', 'security', 'appearance', 'accessibility', 'account'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({ error: 'Invalid settings section' });
    }

    // Find or create user settings
    let settings = await UserSettings.findOne({ userId: req.user.id } as any);
    if (!settings) {
      settings = new UserSettings({ userId: req.user.id });
    }

    // Update the specific section
    (settings as any)[section] = {
      ...(settings as any)[section],
      ...sectionData
    };

    await settings.save();

    res.json({ 
      message: `${section} settings updated successfully`,
      settings: (settings as any)[section]
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

/**
 * Get a specific settings section
 */
export const getSettingsSection = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { section } = req.params;

    const settings = await UserSettings.findOne({ userId: req.user.id } as any);
    if (!settings) {
      return res.status(404).json({ error: 'Settings not found' });
    }

    const sectionData = (settings as any)[section];
    if (!sectionData) {
      return res.status(404).json({ error: `Section "${section}" not found` });
    }

    res.json({ [section]: sectionData });
  } catch (error: any) {
    console.error('Error fetching settings section:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

/**
 * Refresh JWT access token using refresh token
 */
export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally generate new refresh token (rotate for better security)
    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
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

/**
 * Update user profile (name, email can be managed here)
 * Note: Email change should require verification
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, phone } = req.body;

    // Update in UserSettings (profile section)
    let settings = await UserSettings.findOne({ userId: req.user.id } as any);
    if (!settings) {
      settings = new UserSettings({ userId: req.user.id });
    }

    if (phone) {
      settings.profile = settings.profile || {};
      settings.profile.phone = phone;
      await settings.save();
    }

    // TODO: Update user name in User model if needed
    // This would be: await User.findByIdAndUpdate(req.user.id, { name })

    res.json({
      message: 'Profile updated successfully',
      profile: settings.profile
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Initialize default settings for a new user
 */
export const initializeDefaultSettings = async (userId: string) => {
  try {
    const existingSettings = await UserSettings.findOne({ userId } as any);
    if (existingSettings) {
      return existingSettings;
    }

    const settings = new UserSettings({ userId });
    await settings.save();
    return settings;
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw error;
  }
};
