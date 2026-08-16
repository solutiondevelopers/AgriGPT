import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Paperclip, Mic, Sparkles, Bookmark, Copy, Languages, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MessageRenderer } from '../components/MessageRenderer';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import { useLanguage } from '../contexts/LanguageContext';

const SUGGESTED_PROMPTS = [
  "Show my farm analytics",
  "Generate revenue trend line chart",
  "Show water usage heatmap",
  "Buy tomato seeds",
  "Track my order",
];

export function AdvisorChat() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { 
    messages, 
    sendMessage, 
    isLoadingMessages, 
    isSaving, 
    saveError
  } = useChat();

  const [input, setInput] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const lastSpokenMessageIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSaving, isLoadingMessages]);

  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastSpokenMessageIdRef.current !== lastMessage.id && !isSaving) {
        lastSpokenMessageIdRef.current = lastMessage.id;
        
        // Handle Auto-Navigate
        const navigateMatch = lastMessage.content.match(/```json:navigate\n([\s\S]*?)\n```/);
        if (navigateMatch) {
            try {
                const navData = JSON.parse(navigateMatch[1]);
                if (navData.path) {
                    setTimeout(() => {
                        navigate(navData.path);
                    }, 1000); // Wait 1 second before navigating
                }
            } catch(e) {}
        }
        
        if ('speechSynthesis' in window) {
           window.speechSynthesis.cancel();
           const utterance = new SpeechSynthesisUtterance(lastMessage.content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/```[\s\S]*?```/g, ''));
           utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
           
           const voices = window.speechSynthesis.getVoices();
           const targetLang = utterance.lang;
           const voice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
           if (voice) {
               utterance.voice = voice;
           }
           
           window.speechSynthesis.speak(utterance);
        }
      }
    }
  }, [messages, autoSpeak, isSaving, language, navigate]);


  
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
          text: content.replace(/\*\*/g, ''), // strip markdown bold for cleaner translation
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

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendPrompt = (prompt: string) => {
    submitMessage(prompt);
  };

  const submitMessage = async (text: string) => {
    if ((!text.trim() && !attachedImage) || isSaving) return;

    let attachments: Array<{ type: string; url: string }> | undefined;
    if (attachedImage) {
      attachments = [{ type: 'image', url: attachedImage }];
    }

    const textToSend = text;
    setInput('');
    setAttachedImage(null);

    await sendMessage(textToSend, attachments);
  };

  const toggleListen = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => { setIsListening(true); setAutoSpeak(true); };
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setInput(finalTranscript);
            submitMessage(finalTranscript);
          } else {
            setInput(interimTranscript);
          }
        };
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone permissions in your browser.');
          }
        };
        recognition.onend = () => {
           setIsListening(false);
        };
        
        recognition.start();
      } else {
        alert(t('chat.voiceNotSupported'));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
      {/* Top Action Bar */}
      <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-start gap-2 z-10 pointer-events-none">
        <div className="pointer-events-auto flex">
          {isSearchOpen ? (
            <div className="flex items-center bg-white/90 backdrop-blur border border-slate-300 rounded-lg overflow-hidden h-8">
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent border-none text-xs text-slate-800 px-3 w-40 outline-none focus:ring-0"
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="px-2 text-slate-600 hover:text-slate-800">
                &times;
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Search chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
      </div>
    </div>

      {/* Network / Saving Error Banner */}
      {saveError && (
        <div className="absolute top-14 left-4 right-4 z-20 max-w-xl mx-auto bg-red-900/80 border border-red-700/80 text-red-100 text-base font-bold font-semibold px-6 py-4 min-h-[56px] text-lg min-h-[48px] rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-300" />
            <span>{saveError}</span>
          </div>
        </div>
      )}

      {/* Main Messages Container */}
      <div className="flex-1 overflow-y-auto scroll-smooth pb-4">
        <div className="max-w-3xl mx-auto w-full px-4 pt-16 pb-36 space-y-8">
          
          {isLoadingMessages ? (
            <div className="space-y-6 pt-8">
              <div className="flex gap-4 animate-pulse">
                <div className="w-7 h-7 rounded-md bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-12 bg-slate-100/60 rounded" />
                </div>
              </div>
              <div className="flex gap-4 animate-pulse">
                <div className="w-7 h-7 rounded-md bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-16 bg-slate-100/60 rounded" />
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredMessages.map((message) => (
                <motion.div 
                  key={message.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border",
                    message.role === 'user' ? "bg-slate-100 border-slate-300 text-slate-700" : "bg-emerald-50 border-emerald-500/20 text-emerald-600"
                  )}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 group/message">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-slate-700">
                        {message.role === 'user' ? 'You' : 'AgriGPT'}
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/message:opacity-100 transition-opacity">
                        {message.role === 'assistant' && (
                          <button 
                            className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            title={t('chat.readAloud') || 'Read aloud'}
                            onClick={() => {
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel(); // Stop any currently playing speech
                                const utterance = new SpeechSynthesisUtterance(message.content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/```[\s\S]*?```/g, ''));
                                utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
                                
                                // Try to find a specific voice for the language if possible
                                const voices = window.speechSynthesis.getVoices();
                                const targetLang = utterance.lang;
                                const voice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
                                if (voice) {
                                    utterance.voice = voice;
                                }
                                
                                window.speechSynthesis.speak(utterance);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                          </button>
                        )}
                        <button 
                          onClick={() => handleTranslate(message.id, message.content)}
                          className={cn("p-1 hover:bg-slate-100 rounded transition-colors", translatedMessages[message.id] ? "text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                          title={translatedMessages[message.id] ? "Show Original" : "Translate"}
                        >
                          {isTranslating === message.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Languages className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => navigator.clipboard.writeText(translatedMessages[message.id] || message.content)}
                          className="p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title={t('chat.copy')}
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => toggleBookmark(message.id)}
                          className={cn("p-1 hover:bg-slate-100 rounded transition-colors", bookmarkedIds.has(message.id) ? "text-emerald-600" : "text-slate-500 hover:text-slate-700")}
                          title={t('chat.bookmark')}
                        >
                          <Bookmark className={cn("w-5 h-5", bookmarkedIds.has(message.id) && "fill-current")} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-[15px] text-slate-800 leading-relaxed space-y-2">
                      {/* Attached images preview */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {message.attachments.map((att, i) => (
                            <img key={i} src={att.url} alt="User attachment" className="h-32 rounded-lg border border-slate-300 object-cover" />
                          ))}
                        </div>
                      )}

                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{translatedMessages[message.id] || message.content}</div>
                      ) : (
                        <MessageRenderer content={translatedMessages[message.id] || message.content} onSelectFollowup={handleSendPrompt} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isSaving && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                   <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-semibold mb-1 text-slate-700">AgriGPT</div>
                     <div className="flex items-center gap-1.5 h-6">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                       <span className="text-xs text-slate-500 ml-2">{t('chat.saving')}</span>
                     </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="flex-none bg-gradient-to-t from-slate-50/50 via-slate-50 to-slate-50 pt-2 pb-4 sm:pb-6 px-4">
        <div className="max-w-3xl mx-auto w-full relative">
          
          

          <form onSubmit={handleSubmit} className="flex flex-col bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
            {attachedImage && (
              <div className="relative p-3 w-fit">
                <img src={attachedImage} alt="Attached" className="h-16 w-16 object-cover rounded-md border border-slate-300" />
                <button 
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 bg-white text-slate-700 rounded-full p-0.5 hover:bg-slate-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={t('chat.placeholder')}
              className="bg-transparent border-none text-[15px] font-medium flex-1 outline-none text-slate-800 placeholder:text-slate-400 min-h-[52px] max-h-40 resize-none py-3.5 px-5 scrollbar-thin"
              disabled={isSaving}
              rows={1}
            />
            <div className="flex justify-between items-center px-2 pb-2">
              <div className="flex gap-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors" 
                  title="Attach image"
                >
                  <Paperclip className="w-6 h-6" />
                </button>
                <button 
                  type="button" 
                  onClick={toggleListen}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isListening ? "text-red-400 bg-red-400/10 animate-pulse" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  )}
                  title="Voice input"
                >
                  <Mic className="w-6 h-6" />
                </button>
              </div>
              <button
                type="submit"
                disabled={(!input.trim() && !attachedImage) || isSaving}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none hover:from-emerald-500 hover:to-teal-400 transition-all ml-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-slate-500">{t('chat.disclaimer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
