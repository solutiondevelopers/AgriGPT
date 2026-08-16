const fs = require('fs');
let chat = fs.readFileSync('src/pages/AdvisorChat.tsx', 'utf8');

if (!chat.includes('import { Languages }')) {
  chat = chat.replace('Copy, Download, RefreshCw', 'Copy, Download, RefreshCw, Languages');
}

if (!chat.includes('const [translatedMessages')) {
  chat = chat.replace('const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());', 
    'const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());\n  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});\n  const [isTranslating, setIsTranslating] = useState<string | null>(null);');
}

const translateFunc = `
  const handleTranslate = async (messageId: string, content: string) => {
    if (translatedMessages[messageId]) {
      // Toggle back (remove translation)
      const newMap = { ...translatedMessages };
      delete newMap[messageId];
      setTranslatedMessages(newMap);
      return;
    }
    
    setIsTranslating(messageId);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: content.replace(/\\*\\*/g, ''), // strip markdown bold for cleaner translation
          target_language_code: language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN' 
        })
      });
      const data = await res.json();
      if (data.translated_text) {
        setTranslatedMessages(prev => ({ ...prev, [messageId]: data.translated_text }));
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsTranslating(null);
    }
  };
`;

if (!chat.includes('const handleTranslate')) {
  chat = chat.replace('const toggleBookmark', translateFunc + '\n  const toggleBookmark');
}

// In the JSX, we render the translated content if it exists.
// And add the button next to the copy button.

const renderLogic = `
                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap font-medium text-slate-900">{translatedMessages[message.id] || message.content}</div>
                      ) : (
                        <MessageRenderer content={translatedMessages[message.id] || message.content} onSelectFollowup={handleSendPrompt} />
                      )}
`;

chat = chat.replace(/\{\s*message\.role === 'user' \? \([\s\S]*?<MessageRenderer content=\{message\.content\} onSelectFollowup=\{handleSendPrompt\} \/>\s*\)\}/, renderLogic.trim());

const btnLogic = `
                        <button 
                          onClick={() => handleTranslate(message.id, message.content)}
                          className={cn("p-1 hover:bg-slate-100 rounded transition-colors", translatedMessages[message.id] ? "text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                          title={translatedMessages[message.id] ? "Show Original" : "Translate"}
                        >
                          {isTranslating === message.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => navigator.clipboard.writeText(translatedMessages[message.id] || message.content)}
`;

chat = chat.replace(/<button \s*onClick=\{\(\) => navigator\.clipboard\.writeText\(message\.content\)\}/, btnLogic.trim());

fs.writeFileSync('src/pages/AdvisorChat.tsx', chat);
console.log('Added Translate button');
