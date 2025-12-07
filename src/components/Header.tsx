
import React from 'react';
import { Infinity, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { ChatMode } from '../types';
import { clsx } from 'clsx';

interface HeaderProps {
  onlineCount: number;
  mode: ChatMode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onlineCount, mode, theme, toggleTheme, onDisconnect }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-slate-900 dark:text-white">
          <Infinity className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Chatzuno</h1>
          {mode === ChatMode.CONNECTED ? (
             <div className="flex items-center gap-1.5">
               <span className="relative flex h-2 w-2">
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Global Chat</span>
             </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{onlineCount.toLocaleString()} online</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {mode === ChatMode.CONNECTED && (
          <>
             <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
              <Settings size={20} />
             </button>
             <button 
              onClick={onDisconnect}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              End
            </button>
            <button onClick={onDisconnect} className="sm:hidden p-2 text-red-500">
               <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
