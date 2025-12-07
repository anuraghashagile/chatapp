
import React, { useState } from 'react';
import { X, Globe, Plus, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { COMMON_INTERESTS } from '../constants';
import { Button } from './Button';
import { clsx } from 'clsx';

interface JoinModalProps {
  onClose: () => void;
  onJoin: (profile: UserProfile) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ onClose, onJoin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('18-21');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (interests.length >= 5) return;
      setInterests(prev => [...prev, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin({
      username: name || 'Stranger',
      gender,
      age,
      interests,
      location: 'India (General)' // Simplified for demo
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join the network</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Setup your anonymous profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
                <select 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                >
                  <option>18-21</option>
                  <option>22-25</option>
                  <option>26-30</option>
                  <option>30+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
              <div className="relative">
                <input 
                  type="text" 
                  value="India (General)"
                  readOnly
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none cursor-not-allowed"
                />
                <Globe className="absolute right-4 top-3 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interests</label>
              <input 
                 type="text"
                 placeholder="Coding, Travel, Music..."
                 value={interestInput}
                 onChange={(e) => setInterestInput(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     e.preventDefault();
                     if (interestInput.trim()) {
                       toggleInterest(interestInput.trim());
                       setInterestInput('');
                     }
                   }
                 }}
                 className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {COMMON_INTERESTS.slice(0, 4).map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                      interests.includes(interest)
                        ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-500"
                    )}
                  >
                    + {interest}
                  </button>
                ))}
              </div>
              {interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                   {interests.map(i => (
                     <span key={i} className="px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded text-xs font-semibold flex items-center gap-1">
                       {i}
                       <button type="button" onClick={() => toggleInterest(i)}><X size={12}/></button>
                     </span>
                   ))}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              fullWidth 
              className="h-14 text-lg bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/20 mt-4"
            >
              Start Chatting <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};