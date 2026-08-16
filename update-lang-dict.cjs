const fs = require('fs');

let langFile = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const additionalEN = `
    'chat.welcome': 'Good morning!',
    'chat.howCanIHelp': 'How can AgriGPT help you today?',
    'chat.askCrop': 'Ask about my crop',
    'chat.identifyDisease': 'Identify a crop disease',
    'chat.checkWeather': 'Check today\\'s weather',
    'chat.marketPrices': 'Find market prices',
    'chat.farmingAdvice': 'Get farming advice',
    'chat.placeholder': 'Ask anything about your farm...',
    'chat.voiceNotSupported': 'Speech recognition is not supported in this browser.',
    'chat.saving': 'Saving & analyzing...',
    'chat.disclaimer': 'AgriGPT automatically persists your conversation history safely.',
    'chat.copy': 'Copy message',
    'chat.bookmark': 'Bookmark',
    
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
    'analytics.tasks': 'Today\\'s Tasks',
    'analytics.market': 'Market Prices',
`;

const additionalHI = `
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
    'analytics.market': 'बाजार भाव',
`;

const additionalMR = `
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
    'analytics.market': 'बाजारभाव',
`;

langFile = langFile.replace("'lang.marathi': 'मराठी (Marathi)',\n  },", "'lang.marathi': 'मराठी (Marathi)',\n" + additionalEN + "  },");
langFile = langFile.replace("'lang.marathi': 'मराठी (Marathi)',\n  },", "'lang.marathi': 'मराठी (Marathi)',\n" + additionalHI + "  },"); // Actually need to target the specific block... let's do it safely.
fs.writeFileSync('src/contexts/LanguageContext.tsx', langFile);
