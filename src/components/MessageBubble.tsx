
import React from 'react';
import { Message } from '../types';
import { clsx } from 'clsx';
import { Flag, Smile } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (message.sender === 'system') {
    return (
      <div className="flex flex-col items-center gap-1 my-6 opacity-75">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {message.sender.toUpperCase()}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full text-center max-w-[80%]">
          {message.text}
        </span>
      </div>
    );
  }

  const isMe = message.sender === 'me';

  return (
    <div className={clsx("flex w-full mb-4 group", isMe ? "justify-end" : "justify-start")}>
      <div className={clsx("flex flex-col max-w-[85%]", isMe ? "items-end" : "items-start")}>
        <div className="text-[10px] text-slate-400 mb-1 px-1 font-medium uppercase">
            {isMe ? 'You' : 'Stranger'}
        </div>
        <div 
          className={clsx(
            "px-5 py-3 rounded-2xl text-[15px] leading-relaxed break-words shadow-sm relative transition-all",
            isMe 
              ? "bg-brand-50 dark:bg-brand-600 text-slate-900 dark:text-white rounded-tr-none border border-brand-100 dark:border-brand-500" 
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700"
          )}
        >
          {message.text}
        </div>
        
        {/* Actions (Only for stranger messages, visualized for demo) */}
        {!isMe && (
           <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Smile size={14}/></button>
              <button className="text-slate-400 hover:text-red-500"><Flag size={14}/></button>
           </div>
        )}
        
        <div className="text-[10px] text-slate-300 dark:text-slate-600 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
