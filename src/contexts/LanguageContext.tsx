import React, { createContext, useContext, useState, useEffect } from 'react';
export type LanguageCode = 'en' | 'hi' | 'mr';
export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  shortLabel: string;
}
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', shortLabel: 'EN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', shortLabel: 'HI' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', shortLabel: 'MR' },
];
export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  currentLanguage: LanguageOption;
  t: (key: string) => string;
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    'app.title': 'AgriGPT OS',
    'nav.chat': 'Chat',
    'nav.3dView': '3D Farm View',
    'nav.store': 'AgroStore',
    'nav.analytics': 'Analytics',
    'nav.schemes': 'Gov Schemes',
    'nav.weather': 'Weather',
    'nav.diseaseScan': 'Disease Scan',
    'nav.settings': 'Settings',
    'nav.logout': 'Log out',
    'nav.newChat': 'New Chat',
    'nav.recent': 'Recent',
    'header.copilot': 'AI Copilot',
    'header.cart': 'Shopping Cart',
    'lang.select': 'Select Language',
    'lang.english': 'English',
    'lang.hindi': 'हिंदी (Hindi)',
    'lang.marathi': 'मराठी (Marathi)',
    'chat.welcome': 'Good morning!',
    'chat.howCanIHelp': 'How can AgriGPT help you today?',
    'chat.askCrop': 'Ask about my crop',
    'chat.identifyDisease': 'Identify a crop disease',
    'chat.checkWeather': 'Check today\'s weather',
    'chat.marketPrices': 'Find market prices',
    'chat.farmingAdvice': 'Get farming advice',
    'chat.placeholder': 'Ask anything about your farm...',
    'chat.voiceNotSupported': 'Speech recognition is not supported in this browser.',
    'chat.saving': 'Saving & analyzing...',
    'chat.disclaimer': 'AgriGPT automatically persists your conversation history safely.',
    'chat.copy': 'Copy message',
    'chat.bookmark': 'Bookmark',
    'chat.readAloud': 'Read Aloud',
    'chat.autoSpeak': 'Auto-Speak Responses',
    'store.title': 'AgroStore',
    'store.search': 'Search seeds, fertilizers...',
    'store.sort.popular': 'Highest Rated',
    'store.sort.priceLow': 'Price: Low to High',
    'store.sort.priceHigh': 'Price: High to Low',
    'store.inStock': 'In Stock',
    'store.addToCart': 'Add to Cart',
    'weather.title': 'Weather Dashboard',
    'weather.current': 'Current Weather',
    'weather.forecast': '7-Day Forecast',
    'weather.wind': 'Wind Speed',
    'weather.humidity': 'Humidity',
    'scan.title': 'Disease Scan',
    'scan.upload': 'Upload an image of your crop',
    'scan.camera': 'Use Camera',
    'scan.analyzing': 'Analyzing disease...',
    'analytics.title': 'Analytics Dashboard',
    'analytics.revenue': 'Revenue vs Expenses',
    'analytics.yield': 'Yield Prediction',
    'analytics.tasks': 'Today\'s Tasks',
    'analytics.market': 'Market Prices'
  },
  hi: {
    'app.title': 'एग्रीजीपीटी ओएस',
    'nav.chat': 'चैट',
    'nav.3dView': '3D फार्म दृश्य',
    'nav.store': 'एग्रो स्टोर',
    'nav.analytics': 'विश्लेषण',
    'nav.schemes': 'सरकारी योजनाएं',
    'nav.weather': 'मौसम',
    'nav.diseaseScan': 'रोग स्कैन',
    'nav.settings': 'सेटिंग्स',
    'nav.logout': 'लॉग आउट',
    'nav.newChat': 'नई चैट',
    'nav.recent': 'हालिया',
    'header.copilot': 'एआई सह-पायलट',
    'header.cart': 'शॉपिंग कार्ट',
    'lang.select': 'भाषा चुनें',
    'lang.english': 'English (अंग्रेज़ी)',
    'lang.hindi': 'हिंदी (Hindi)',
    'lang.marathi': 'मराठी (Marathi)',
    'chat.welcome': 'सुप्रभात!',
    'chat.howCanIHelp': 'आज AgriGPT आपकी कैसे मदद कर सकता है?',
    'chat.askCrop': 'अपनी फसल के बारे में पूछें',
    'chat.identifyDisease': 'फसल रोग की पहचान करें',
    'chat.checkWeather': 'आज का मौसम जांचें',
    'chat.marketPrices': 'बाजार भाव खोजें',
    'chat.farmingAdvice': 'खेती की सलाह लें',
    'chat.placeholder': 'अपने खेत के बारे में कुछ भी पूछें...',
    'chat.voiceNotSupported': 'इस ब्राउज़र में ध्वनि पहचान समर्थित नहीं है।',
    'chat.saving': 'सहेज और विश्लेषण कर रहा है...',
    'chat.disclaimer': 'AgriGPT स्वचालित रूप से आपके वार्तालाप इतिहास को सुरक्षित रूप से सहेजता है।',
    'chat.copy': 'संदेश कॉपी करें',
    'chat.bookmark': 'बुकमार्क',
    'chat.readAloud': 'ज़ोर से पढ़ें',
    'chat.autoSpeak': 'स्वचालित उत्तर बोलें',
    'store.title': 'एग्रो स्टोर',
    'store.search': 'बीज, उर्वरक खोजें...',
    'store.sort.popular': 'सबसे अधिक रेटेड',
    'store.sort.priceLow': 'कीमत: कम से अधिक',
    'store.sort.priceHigh': 'कीमत: अधिक से कम',
    'store.inStock': 'स्टॉक में',
    'store.addToCart': 'कार्ट में डालें',
    'weather.title': 'मौसम डैशबोर्ड',
    'weather.current': 'वर्तमान मौसम',
    'weather.forecast': '7-दिवसीय पूर्वानुमान',
    'weather.wind': 'हवा की गति',
    'weather.humidity': 'नमी',
    'scan.title': 'रोग स्कैन',
    'scan.upload': 'अपनी फसल की तस्वीर अपलोड करें',
    'scan.camera': 'कैमरा उपयोग करें',
    'scan.analyzing': 'रोग का विश्लेषण कर रहा है...',
    'analytics.title': 'विश्लेषण डैशबोर्ड',
    'analytics.revenue': 'आय बनाम व्यय',
    'analytics.yield': 'उपज भविष्यवाणी',
    'analytics.tasks': 'आज के कार्य',
    'analytics.market': 'बाजार भाव'
  },
  mr: {
    'app.title': 'अ‍ॅग्रीजीपीटी ओएस',
    'nav.chat': 'चॅट',
    'nav.3dView': '3D शेती दृश्य',
    'nav.store': 'अ‍ॅग्रो स्टोअर',
    'nav.analytics': 'विश्लेषण',
    'nav.schemes': 'सरकारी योजना',
    'nav.weather': 'हवामान',
    'nav.diseaseScan': 'रोग स्कॅन',
    'nav.settings': 'सेटिंग्ज',
    'nav.logout': 'लॉग आउट',
    'nav.newChat': 'नवीन चॅट',
    'nav.recent': 'नुकतेच',
    'header.copilot': 'एआय सह-पायलट',
    'header.cart': 'खरेदी कार्ट',
    'lang.select': 'भाषा निवडा',
    'lang.english': 'English (इंग्रजी)',
    'lang.hindi': 'हिंदी (Hindi)',
    'lang.marathi': 'मराठी (Marathi)',
    'chat.welcome': 'सुप्रभात!',
    'chat.howCanIHelp': 'AgriGPT आज तुम्हाला कशी मदत करू शकेल?',
    'chat.askCrop': 'माझ्या पिकाबद्दल विचारा',
    'chat.identifyDisease': 'पिकाचा रोग ओळखा',
    'chat.checkWeather': 'आजचे हवामान तपासा',
    'chat.marketPrices': 'बाजारभाव शोधा',
    'chat.farmingAdvice': 'शेतीचा सल्ला घ्या',
    'chat.placeholder': 'तुमच्या शेताबद्दल काहीही विचारा...',
    'chat.voiceNotSupported': 'या ब्राउझरमध्ये व्हॉइस रेकग्निशन समर्थित नाही.',
    'chat.saving': 'जतन आणि विश्लेषण करत आहे...',
    'chat.disclaimer': 'AgriGPT आपोआप तुमचा संवाद इतिहास सुरक्षितपणे जतन करतो.',
    'chat.copy': 'संदेश कॉपी करा',
    'chat.bookmark': 'बुकमार्क',
    'chat.readAloud': 'मोठ्याने वाचा',
    'chat.autoSpeak': 'स्वयंचलित उत्तरे बोला',
    'store.title': 'अ‍ॅग्रो स्टोअर',
    'store.search': 'बियाणे, खते शोधा...',
    'store.sort.popular': 'सर्वाधिक रेट केलेले',
    'store.sort.priceLow': 'किंमत: कमी ते जास्त',
    'store.sort.priceHigh': 'किंमत: जास्त ते कमी',
    'store.inStock': 'स्टॉकमध्ये',
    'store.addToCart': 'कार्टमध्ये जोडा',
    'weather.title': 'हवामान डॅशबोर्ड',
    'weather.current': 'सध्याचे हवामान',
    'weather.forecast': '७-दिवसीय अंदाज',
    'weather.wind': 'वाऱ्याचा वेग',
    'weather.humidity': 'आर्द्रता',
    'scan.title': 'रोग स्कॅन',
    'scan.upload': 'तुमच्या पिकाचा फोटो अपलोड करा',
    'scan.camera': 'कॅमेरा वापरा',
    'scan.analyzing': 'रोगाचे विश्लेषण करत आहे...',
    'analytics.title': 'विश्लेषण डॅशबोर्ड',
    'analytics.revenue': 'उत्पन्न वि खर्च',
    'analytics.yield': 'उत्पादनाचा अंदाज',
    'analytics.tasks': 'आजची कामे',
    'analytics.market': 'बाजारभाव'
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('agrigpt_language');
      if (saved === 'hi' || saved === 'mr' || saved === 'en') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });
  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem('agrigpt_language', code);
    } catch (e) {}
  };
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage, currentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
export { LanguageContext };
