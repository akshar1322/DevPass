'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Mail, 
  Globe, 
  Database, 
  Terminal, 
  Key, 
  Settings2,
  Check,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  generatePassword, 
  calculateStrength, 
  CATEGORY_PRESETS, 
  type PasswordCategory, 
  type PasswordOptions 
} from '@/lib/password';

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState<PasswordCategory>('webapp');
  const [options, setOptions] = useState<PasswordOptions>(CATEGORY_PRESETS.webapp);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    // Check if we're in the browser before using crypto
    if (typeof window === 'undefined') return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      setStrength(calculateStrength(newPassword));
      setIsGenerating(false);
    }, 200);
  }, [options]);

  useEffect(() => {
    setHasMounted(true);
    handleGenerate();
  }, [handleGenerate]);

  if (!hasMounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden bg-[#030712]">
        <div className="text-zinc-500 animate-pulse font-mono">INITIALIZING VAULT...</div>
      </div>
    );
  }

  const handleCategoryChange = (cat: PasswordCategory) => {
    setCategory(cat);
    setOptions(CATEGORY_PRESETS[cat]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'webapp', name: 'Web App', icon: Globe },
    { id: 'mongodb', name: 'MongoDB', icon: Database },
    { id: 'ssh', name: 'SSH Key', icon: Terminal },
    { id: 'api', name: 'API Key', icon: Key },
    { id: 'custom', name: 'Custom', icon: Settings2 },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <header className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10 border border-primary/20"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
            Vault Generator
          </h1>
          <p className="text-zinc-400 text-lg">
            Create ultra-secure, industrial-grade passwords for all your needs.
          </p>
        </header>

        <div className="glass rounded-3xl p-6 md:p-8 space-y-8">
          {/* Main Password Display */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center justify-between bg-zinc-950/80 rounded-2xl p-6 border border-white/5">
              <motion.div 
                key={password}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-3xl font-mono text-zinc-100 break-all pr-4"
              >
                {password || 'Generating...'}
              </motion.div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="p-3 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  title="Regenerate"
                >
                  <RefreshCw className={cn("w-6 h-6", isGenerating && "animate-spin")} />
                </button>
                <button 
                  onClick={handleCopy}
                  className="p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  <span className="hidden md:inline font-medium">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400 font-medium">Password Strength</span>
              <span className={cn(
                "font-bold uppercase tracking-wider",
                strength < 40 ? "text-red-400" : strength < 70 ? "text-yellow-400" : "text-accent"
              )}>
                {strength < 40 ? 'Weak' : strength < 70 ? 'Good' : 'Strong'}
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                className={cn(
                  "h-full transition-all duration-500",
                  strength < 40 ? "bg-red-500" : strength < 70 ? "bg-yellow-500" : "bg-accent"
                )}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-4">
            <span className="text-zinc-400 text-sm font-medium">Quick Presets</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as PasswordCategory)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    category === cat.id 
                      ? "bg-primary/10 border-primary text-white" 
                      : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <cat.icon className={cn("w-5 h-5", category === cat.id ? "text-primary" : "text-zinc-500")} />
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <label className="text-zinc-400 font-medium">Length: {options.length}</label>
                <input 
                  type="range" 
                  min="8" 
                  max="64" 
                  value={options.length}
                  onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                  className="w-48 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'uppercase', label: 'Uppercase (A-Z)', key: 'includeUppercase' },
                  { id: 'lowercase', label: 'Lowercase (a-z)', key: 'includeLowercase' },
                  { id: 'numbers', label: 'Numbers (0-9)', key: 'includeNumbers' },
                  { id: 'symbols', label: 'Symbols (!@#$)', key: 'includeSymbols' },
                ].map((toggle) => (
                  <label key={toggle.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-zinc-300 font-medium">{toggle.label}</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={(options as any)[toggle.key]}
                        onChange={(e) => setOptions({ ...options, [toggle.key]: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-zinc-500 text-sm space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Encrypted locally in your browser. No data ever leaves your device.</span>
          </div>
          <p>© 2026 Vault Generator • Built for Developers By Techcloude</p>
        </footer>
      </motion.div>
    </div>
  );
}

