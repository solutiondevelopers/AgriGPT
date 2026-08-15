import express from 'express';
import {
  getSettings,
  updateSettingsSection,
  getSettingsSection,
  refreshToken,
  updateProfile
} from '../controllers/settingsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All settings routes require authentication
router.use(verifyToken);

// Get all settings for current user
router.get('/', getSettings);

// Get a specific settings section (e.g., /api/settings/voice)
router.get('/:section', getSettingsSection);

// Update a specific settings section
router.put('/:section', updateSettingsSection);

// Update user profile
router.put('/profile/update', updateProfile);

export default router;
