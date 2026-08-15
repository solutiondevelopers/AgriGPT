import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Paperclip, Mic, Sparkles, Bookmark, Copy, Download, RefreshCw, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../types';
import { cn } from '@/src/lib/utils';
import { MessageRenderer } from '../components/MessageRenderer';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTED_PROMPTS = [
  "Show my farm analytics",
  "Generate revenue trend line chart",
  "Show water usage heatmap",
  "Buy tomato seeds",
  "Track my order",
];

export function AdvisorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'assistant',
    content: "Hello! I'm AgriGPT, your conversational Agriculture Operating System. \n\nI can help you analyze weather, predict yields, compare market prices, or even buy supplies. What would you like to explore today?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleNewChat = () => {
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm AgriGPT, your conversational Agriculture Operating System. \n\nI can help you analyze weather, predict yields, compare market prices, or even buy supplies. What would you like to explore today?",
        timestamp: new Date()
      }]);
    };
    
    window.addEventListener('new-chat', handleNewChat);
    return () => window.removeEventListener('new-chat', handleNewChat);
  }, []);

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
    setInput(prompt);
    // Focus the textarea or directly submit. We'll directly submit.
    submitMessage(prompt);
  };

  const submitMessage = async (text: string) => {
    if (!text.trim() && !attachedImage || isLoading) return;

    let contentToDisplay = text;
    if (attachedImage) {
      contentToDisplay = `![Attached Image](${attachedImage})\n\n${text}`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToDisplay,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    // Create a placeholder message for the assistant
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      
      if (reader) {
        let isDone = false;
        while (!isDone) {
          const { value, done } = await reader.read();
          isDone = done;
          if (value) {
            const chunkText = decoder.decode(value, { stream: true });
            const lines = chunkText.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') {
                  isDone = true;
                  break;
                }
                try {
                  const data = JSON.parse(dataStr);
                  if (data.text) {
                    setMessages(prev => prev.map(m => 
                      m.id === assistantId ? { ...m, content: m.content + data.text } : m
                    ));
                  }
                } catch (e) {
                  // ignore parse error for chunks
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(m => 
        m.id === assistantId ? { ...m, content: "**Error:** I'm having trouble connecting to my knowledge base right now. Please check your network or try again later." } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const [isListening, setIsListening] = useState(false);

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          setInput(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        
        recognition.start();
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleExport = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'AgriGPT'}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AgriGPT_Conversation.txt';
    a.click();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredMessages = messages.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#09090b] relative">
      {/* Top Action Bar */}
      <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-start gap-2 z-10 pointer-events-none">
        <div className="pointer-events-auto flex">
          {isSearchOpen ? (
            <div className="flex items-center bg-[#18181b]/90 backdrop-blur border border-zinc-700 rounded-lg overflow-hidden h-8">
              <input 
                type="text" 
                placeholder="Search chat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="bg-transparent border-none text-xs text-zinc-200 px-3 w-40 outline-none focus:ring-0"
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="px-2 text-zinc-400 hover:text-zinc-200">
                &times;
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-8 h-8 bg-[#18181b]/80 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Search chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          )}
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-[#18181b]/80 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-[#18181b]/80 backdrop-blur border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto w-full px-4 pt-16 pb-36 space-y-8">
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
                  message.role === 'user' ? "bg-zinc-800/80 border-zinc-700/50 text-zinc-300" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                )}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>
                
                <div className="flex-1 min-w-0 group/message">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-semibold text-zinc-300">
                      {message.role === 'user' ? 'You' : 'AgriGPT'}
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/message:opacity-100 transition-opacity">
                      {message.role === 'assistant' && (
                        <button 
                          className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
                          title="Read aloud"
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              const utterance = new SpeechSynthesisUtterance(message.content.replace(/```[\s\S]*?```/g, ''));
                              window.speechSynthesis.speak(utterance);
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                        </button>
                      )}
                      <button 
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
                        title="Copy message"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleBookmark(message.id)}
                        className={cn("p-1 hover:bg-zinc-800 rounded transition-colors", bookmarkedIds.has(message.id) ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300")}
                        title="Bookmark"
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", bookmarkedIds.has(message.id) && "fill-current")} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-zinc-300 leading-relaxed">
                    {message.role === 'user' ? (
                      <div className="whitespace-pre-wrap font-medium text-zinc-100">{message.content}</div>
                    ) : (
                      <MessageRenderer content={message.content} onSelectFollowup={handleSendPrompt} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                 <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                   <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                 </div>
                 <div className="flex-1">
                   <div className="text-sm font-semibold mb-1 text-zinc-300">AgriGPT</div>
                   <div className="flex items-center gap-1.5 h-6">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-12 pb-6 px-4">
        <div className="max-w-3xl mx-auto w-full relative">
          
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-4 justify-center"
            >
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendPrompt(prompt)}
                  className="text-xs px-3 py-1.5 bg-[#18181b] border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-400 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {prompt} <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden focus-within:border-zinc-600 transition-colors">
            {attachedImage && (
              <div className="relative p-3 w-fit">
                <img src={attachedImage} alt="Attached" className="h-16 w-16 object-cover rounded-md border border-zinc-700" />
                <button 
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-1 right-1 bg-zinc-900 text-zinc-300 rounded-full p-0.5 hover:bg-zinc-800"
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
              placeholder="Ask anything about your farm..."
              className="bg-transparent border-none text-sm flex-1 outline-none text-zinc-200 placeholder:text-zinc-500 min-h-[56px] max-h-40 resize-none py-4 px-4 scrollbar-thin"
              disabled={isLoading}
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
                  className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors" 
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={toggleListen}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isListening ? "text-red-400 bg-red-400/10 animate-pulse" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  )}
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={(!input.trim() && !attachedImage) || isLoading}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-100 text-zinc-900 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 hover:bg-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-zinc-500">AgriGPT can make mistakes. Verify critical farming decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
