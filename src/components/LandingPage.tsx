
import React from 'react';
import { ArrowRight, MessageCircle, Ghost, ShieldCheck } from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onlineCount: number;
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onlineCount, onStart }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar Placeholder */}
      <nav className="p-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
           <div className="text-brand-600 dark:text-white">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>
           </div>
           <span className="font-bold text-xl text-slate-900 dark:text-white">Chatzuno</span>
        </div>
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white transition-colors">
           {/* Theme toggle is in parent, simplified here */}
           <Ghost size={20} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Instant chats. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
                Infinite connections.
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto md:mx-0">
              Experience the next generation of anonymous chat. AI-enhanced, secure, and designed for meaningful conversations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 items-center justify-center md:justify-start pt-4">
               <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{onlineCount > 1000 ? (onlineCount / 1000).toFixed(1) + 'k+' : onlineCount}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online Now</div>
               </div>
               <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
               <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">Zero</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trace Log</div>
               </div>
            </div>

            <div className="pt-4">
               <Button 
                 onClick={onStart}
                 className="h-14 px-8 text-lg rounded-xl shadow-xl shadow-brand-500/20 bg-brand-600 hover:bg-brand-700 text-white w-full sm:w-auto"
               >
                 Start Chatting
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="relative z-10 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
               {/* Mock Phone UI */}
               <div className="bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl w-[320px] mx-auto h-[640px] relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                  
                  {/* Chat UI Mockup */}
                  <div className="bg-[#1a1b26] h-full w-full flex flex-col">
                     <div className="h-16 border-b border-slate-800 flex items-center px-4 pt-4 gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center"><Ghost size={16} className="text-white"/></div>
                        <div>
                           <div className="text-white text-xs font-bold">Chatzuno</div>
                           <div className="text-emerald-400 text-[10px] flex items-center gap-1"><span className="w-1 h-1 bg-emerald-400 rounded-full"></span>Online</div>
                        </div>
                     </div>
                     <div className="flex-1 p-4 space-y-4">
                        <div className="flex justify-start">
                           <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[80%]">
                              Look at this view! 🌅
                           </div>
                        </div>
                        <div className="flex justify-start">
                           <div className="bg-slate-800 rounded-2xl rounded-tl-sm overflow-hidden w-32 h-24 relative opacity-50">
                               <div className="absolute inset-0 flex items-center justify-center text-slate-600"><MessageCircle size={20}/></div>
                           </div>
                        </div>
                         <div className="flex justify-end">
                           <div className="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs max-w-[80%]">
                              Hello! How are you doing? 👋
                           </div>
                        </div>
                        <div className="flex justify-end">
                           <div className="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs max-w-[80%] shadow-lg shadow-brand-500/20">
                              I'm doing great! Just chilling. How about you?
                           </div>
                        </div>
                     </div>
                     <div className="p-4 border-t border-slate-800">
                        <div className="flex gap-2 items-center">
                           <div className="text-slate-500">+</div>
                           <div className="h-8 bg-slate-800 rounded-full flex-1 border border-slate-700"></div>
                           <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white"><ArrowRight size={14}/></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-10 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl animate-float delay-700">
               <Ghost className="w-8 h-8 text-pink-500" />
            </div>
             <div className="absolute bottom-40 left-0 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl animate-float">
               <ShieldCheck className="w-8 h-8 text-brand-500" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
