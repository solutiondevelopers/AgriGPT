import mongoose from 'mongoose';

interface IUserSettings {
  userId: mongoose.Types.ObjectId;
  
  // Profile Settings
  profile?: {
    phone?: string;
  };
  
  // Farm Settings (farms are separate, but can reference farm ID here)
  defaultFarmId?: mongoose.Types.ObjectId;
  
  // AI Preferences
  aiPreferences?: {
    proactiveRecommendations: boolean;
    useLocalAPMCPrices: boolean;
  };
  
  // Language Settings
  language?: {
    interface: 'en' | 'mr' | 'hi';
    voiceResponse: 'en' | 'mr' | 'hi';
  };
  
  // Voice Settings
  voice?: {
    enabled: boolean;
    inputLanguage: 'auto' | 'en' | 'mr' | 'hi';
    outputLanguage: 'en' | 'mr' | 'hi';
    quality: 'standard' | 'high' | 'premium';
    speakingRate: number; // 0.5 to 2.0
  };
  
  // Notifications Settings
  notifications?: {
    alertTypes: {
      weatherAlerts: boolean;
      priceAlerts: boolean;
      diseaseAlerts: boolean;
      irrigationReminders: boolean;
      systemUpdates: boolean;
      chatSummaries: boolean;
    };
    channels: {
      inApp: boolean;
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm format
      end: string;   // HH:mm format
    };
  };
  
  // Privacy Settings
  privacy?: {
    allowAnonymizedDataUsage: boolean;
    thirdPartyIntegrations: {
      weatherAPI: boolean;
      marketData: boolean;
      geoLocation: boolean;
      analytics: boolean;
    };
  };
  
  // Security Settings (passwords not stored here, but we can track MFA status)
  security?: {
    mfaEnabled: boolean;
    mfaMethod?: 'authenticator' | 'sms' | 'email';
  };
  
  // Appearance Settings
  appearance?: {
    theme: 'dark' | 'light' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    layoutDensity: 'compact' | 'comfortable' | 'spacious';
  };
  
  // Accessibility Settings
  accessibility?: {
    screenReaderSupport: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
  };
  
  // Account Settings (mostly read-only status display, but can track preferences)
  account?: {
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    storageQuotaMB: number;
    linkedAccounts: string[]; // provider IDs like 'google', 'whatsapp'
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new mongoose.Schema<IUserSettings>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true
    },
    profile: {
      phone: String
    },
    defaultFarmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm'
    },
    aiPreferences: {
      proactiveRecommendations: { type: Boolean, default: true },
      useLocalAPMCPrices: { type: Boolean, default: true }
    },
    language: {
      interface: { type: String, enum: ['en', 'mr', 'hi'], default: 'en' },
      voiceResponse: { type: String, enum: ['en', 'mr', 'hi'], default: 'mr' }
    },
    voice: {
      enabled: { type: Boolean, default: true },
      inputLanguage: { type: String, enum: ['auto', 'en', 'mr', 'hi'], default: 'auto' },
      outputLanguage: { type: String, enum: ['en', 'mr', 'hi'], default: 'mr' },
      quality: { type: String, enum: ['standard', 'high', 'premium'], default: 'standard' },
      speakingRate: { type: Number, default: 1, min: 0.5, max: 2 }
    },
    notifications: {
      alertTypes: {
        weatherAlerts: { type: Boolean, default: true },
        priceAlerts: { type: Boolean, default: true },
        diseaseAlerts: { type: Boolean, default: true },
        irrigationReminders: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true },
        chatSummaries: { type: Boolean, default: false }
      },
      channels: {
        inApp: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false }
      },
      quietHours: {
        enabled: { type: Boolean, default: false },
        start: { type: String, default: '22:00' },
        end: { type: String, default: '08:00' }
      }
    },
    privacy: {
      allowAnonymizedDataUsage: { type: Boolean, default: true },
      thirdPartyIntegrations: {
        weatherAPI: { type: Boolean, default: true },
        marketData: { type: Boolean, default: true },
        geoLocation: { type: Boolean, default: true },
        analytics: { type: Boolean, default: false }
      }
    },
    security: {
      mfaEnabled: { type: Boolean, default: false },
      mfaMethod: { type: String, enum: ['authenticator', 'sms', 'email'] }
    },
    appearance: {
      theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      layoutDensity: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' }
    },
    accessibility: {
      screenReaderSupport: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
      keyboardNavigation: { type: Boolean, default: true }
    },
    account: {
      subscriptionTier: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
      storageQuotaMB: { type: Number, default: 1024 }, // 1GB default
      linkedAccounts: [String]
    }
  },
  { timestamps: true }
);

// Create indexes for performance
userSettingsSchema.index({ userId: 1, createdAt: -1 });

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', userSettingsSchema);
export type { IUserSettings };
