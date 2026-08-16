const fs = require('fs');

let chat = fs.readFileSync('src/pages/AdvisorChat.tsx', 'utf8');

if (!chat.includes('useLanguage')) {
    chat = chat.replace("import { useChat } from '../contexts/ChatContext';", "import { useChat } from '../contexts/ChatContext';\nimport { useLanguage } from '../contexts/LanguageContext';");
}

chat = chat.replace("export function AdvisorChat() {", "export function AdvisorChat() {\n  const { t, language } = useLanguage();");

// Voice recognition language mapping
const voiceLangReplacement = `
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
        recognition.continuous = false;
`;

chat = chat.replace(/if \(SpeechRecognition\) {\s*const recognition = new SpeechRecognition\(\);\s*recognition\.continuous = false;/g, voiceLangReplacement);

// Replace static strings with t()
chat = chat.replace(/'Good morning!'/g, "t('chat.welcome')");
chat = chat.replace(/'How can AgriGPT help you today\?'/g, "t('chat.howCanIHelp')");
chat = chat.replace(/'Ask about my crop'/g, "t('chat.askCrop')");
chat = chat.replace(/'Identify a crop disease'/g, "t('chat.identifyDisease')");
chat = chat.replace(/'Check today\\'s weather'/g, "t('chat.checkWeather')");
chat = chat.replace(/'Find market prices'/g, "t('chat.marketPrices')");
chat = chat.replace(/'Get farming advice'/g, "t('chat.farmingAdvice')");

chat = chat.replace(/"Ask anything about your farm\.\.\."/g, "t('chat.placeholder')");
chat = chat.replace(/"Speech recognition is not supported in this browser\."/g, "t('chat.voiceNotSupported')");
chat = chat.replace(/"Saving & analyzing\.\.\."/g, "t('chat.saving')");
chat = chat.replace(/"AgriGPT automatically persists your conversation history safely\."/g, "t('chat.disclaimer')");
chat = chat.replace(/"Copy message"/g, "t('chat.copy')");
chat = chat.replace(/"Bookmark"/g, "t('chat.bookmark')");
// There might be direct text strings like:
chat = chat.replace(/>🌱 Good morning!</g, ">🌱 {t('chat.welcome')}<");
chat = chat.replace(/>\s*How can AgriGPT help you today\?\s*</g, ">{t('chat.howCanIHelp')}<");
chat = chat.replace(/>Saving & analyzing\.\.\.</g, ">{t('chat.saving')}<");
chat = chat.replace(/>AgriGPT automatically persists your conversation history safely\.</g, ">{t('chat.disclaimer')}<");


fs.writeFileSync('src/pages/AdvisorChat.tsx', chat);
console.log('AdvisorChat updated');
