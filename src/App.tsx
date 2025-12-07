
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RefreshCw, EyeOff, Shield, Image as ImageIcon, Mic, X, Square } from 'lucide-react';
import { Message, ChatMode, UserProfile } from './types';
import { useHumanChat } from './hooks/useHumanChat';
import { MessageBubble } from './components/MessageBubble';
import { Button } from './components/Button';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { JoinModal } from './components/JoinModal';
import { clsx } from 'clsx';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onlineCount] = useState(() => Math.floor(Math.random() * 25000) + 20000);
  const [inputText, setInputText] = useState('');
  const [vanishMode, setVanishMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize Chat Hook
  const { 
    messages, 
    status, 
    partnerTyping, 
    partnerRecording,
    partnerProfile,
    sendMessage, 
    sendImage,
    sendAudio,
    sendTyping, 
    sendRecording,
    connect, 
    disconnect 
  } = useHumanChat(userProfile);

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping, partnerRecording]);

  const handleStartClick = () => setShowJoinModal(true);

  const handleJoin = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowJoinModal(false);
    connect();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
    sendTyping(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    sendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1000);
  };

  const handleNewChat = () => {
    disconnect();
    setTimeout(connect, 200);
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        sendImage(base64);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- AUDIO RECORDING ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
           const base64Audio = reader.result as string;
           sendAudio(base64Audio);
        };
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      sendRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      sendRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Clear chunks to prevent sending
      audioChunksRef.current = [];
      // Hacky way to prevent onstop sending logic: check ref inside onstop or just let it fail
      // Better: override onstop
      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        sendRecording(false);
      };
    }
  };

  // --- 1. LANDING PAGE ---
  if (status === ChatMode.IDLE && !userProfile) {
    return (
      <>
        <LandingPage onlineCount={onlineCount} onStart={handleStartClick} />
        {showJoinModal && (
          <JoinModal 
            onClose={() => setShowJoinModal(false)} 
            onJoin={handleJoin} 
          />
        )}
      </>
    );
  }

  // --- 2. CONNECTING SCREEN ---
  if (status === ChatMode.SEARCHING || status === ChatMode.WAITING || (status === ChatMode.IDLE && userProfile)) {
    return (
      <div className="h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative z-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-full shadow-2xl border border-slate-200 dark:border-slate-800">
             <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Matching you...</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto animate-pulse mb-8">
           Finding a stranger with similar vibes...
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto mb-12">
           {userProfile?.interests.map(i => (
              <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-medium">
                 {i}
              </span>
           ))}
        </div>

        <Button variant="secondary" onClick={() => { disconnect(); setUserProfile(null); }}>
          Cancel
        </Button>
      </div>
    );
  }

  // --- 3. MAIN CHAT SCREEN ---
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors fixed inset-0">
      <Header 
        onlineCount={onlineCount} 
        mode={status} 
        theme={theme}
        toggleTheme={toggleTheme}
        onDisconnect={() => { disconnect(); setUserProfile(null); }}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 pb-24 sm:pb-4">
        {/* Partner Info Banner */}
        {partnerProfile && (
          <div className="flex justify-center mb-8 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-4 max-w-md w-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                   {partnerProfile.username[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                   <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{partnerProfile.username}</h4>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 shrink-0">{partnerProfile.age}</span>
                   </div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      {partnerProfile.gender} • {partnerProfile.location}
                   </div>
                </div>
             </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} senderName={partnerProfile?.username} />
        ))}
        
        {/* Disconnect State */}
        {status === ChatMode.DISCONNECTED && (
          <div className="py-8 flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
               <Shield size={32} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Chat Ended</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">You disconnected from the stranger.</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleNewChat} className="shadow-lg shadow-brand-500/20 px-8">
                <RefreshCw size={18} />
                Find New Stranger
              </Button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 safe-area-bottom z-20">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
           {/* Indicators */}
           <div className="h-6 mb-1 px-4">
              {partnerTyping && (
                <div className="text-xs text-brand-500 font-medium animate-pulse flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-75"></span>
                   <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce delay-150"></span>
                   {partnerProfile ? partnerProfile.username : 'Stranger'} is typing...
                </div>
              )}
              {partnerRecording && (
                <div className="text-xs text-red-500 font-medium animate-pulse flex items-center gap-1">
                   <Mic size={12} />
                   {partnerProfile ? partnerProfile.username : 'Stranger'} is recording audio...
                </div>
              )}
           </div>

           <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            {/* Image Upload Button */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={status !== ChatMode.CONNECTED}
            />
            <button
               type="button"
               onClick={() => fileInputRef.current?.click()}
               className="p-3 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
               disabled={status !== ChatMode.CONNECTED}
            >
               <ImageIcon size={24} />
            </button>

            <div className="relative flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center">
              {isRecording ? (
                 <div className="flex-1 flex items-center justify-between px-4 py-3 text-red-500 font-medium animate-pulse">
                    <div className="flex items-center gap-2">
                       <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                       Recording...
                    </div>
                    <button 
                       type="button" 
                       onClick={cancelRecording}
                       className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                    >
                       <X size={20} />
                    </button>
                 </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleTyping}
                    disabled={status !== ChatMode.CONNECTED}
                    placeholder={status === ChatMode.CONNECTED ? "Type a message..." : "Stranger has disconnected"}
                    className="w-full bg-transparent border-0 px-4 py-3 sm:py-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none disabled:opacity-50 max-h-32 overflow-y-auto"
                    autoFocus
                  />
                  <button
                     type="button"
                     onClick={() => setVanishMode(!vanishMode)}
                     className={clsx(
                       "p-2 mr-2 rounded-full transition-colors",
                       vanishMode ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                     )}
                     title="Vanish Mode"
                  >
                     <EyeOff size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Mic / Send Button */}
            {inputText.trim() ? (
               <button
                 type="submit"
                 className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
               >
                 <Send size={24} />
               </button>
            ) : isRecording ? (
               <button
                 type="button"
                 onClick={stopRecording}
                 className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition-all animate-pulse"
               >
                 <Square size={24} fill="currentColor" />
               </button>
            ) : (
               <button
                 type="button"
                 onClick={startRecording}
                 className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                 disabled={status !== ChatMode.CONNECTED}
               >
                 <Mic size={24} />
               </button>
            )}
          </form>
          <div className="text-center mt-2 hidden sm:block">
             <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <Shield size={10} /> End-to-End Encrypted • Zero Trace
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
