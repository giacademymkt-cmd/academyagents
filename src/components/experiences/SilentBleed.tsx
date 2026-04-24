import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SilentBleed({ onComplete }: { onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [cash, setCash] = useState(485000);
  const [started, setStarted] = useState(false);
  const [isDead, setIsDead] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const playTickTock = (timeRemaining: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const playClick = (freq: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };

    // Fica mais agudo e mais alto conforme o tempo acaba
    const urgency = 15 - timeRemaining;
    playClick(1000 + (urgency * 100), 0.2 + (urgency * 0.05));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleStart = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    setStarted(true);
  };

  useEffect(() => {
    if (!started || isDead) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next === 3) {
          // A MORTE SILENCIOSA NO SEGUNDO 3
          setIsDead(true);
          if (audioCtxRef.current) audioCtxRef.current.close();
          return 0;
        }
        playTickTock(next);
        return next;
      });
      
      // Sangramento de caixa agressivo
      setCash(prev => prev - (Math.random() * 15000 + 5000));
      
    }, 1000);

    return () => clearInterval(timer);
  }, [started, isDead]);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="relative w-full h-full min-h-[700px] bg-black overflow-hidden font-mono flex items-center justify-center select-none">
      
      {!started ? (
        <motion.div 
          className="text-center cursor-pointer p-12 bg-red-900/10 hover:bg-red-900/30 border border-red-900/50 rounded-full transition-colors"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2 className="text-red-500 font-bold uppercase tracking-[0.5em] text-sm animate-pulse">Destrancar o Cofre</h2>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {!isDead ? (
            <motion.div 
              key="bomb"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center relative z-10 w-full"
            >
              {/* LED Timer */}
              <div className="flex justify-center mb-8">
                <div className="bg-[#0a0000] border-2 border-red-900 rounded-lg p-6 shadow-[0_0_100px_rgba(255,0,0,0.3)]">
                  <span className="font-mono text-7xl md:text-9xl text-red-600 font-black tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,0,0,0.8)' }}>
                    00:{timeLeft.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              {/* Sangramento */}
              <div className="flex flex-col items-center">
                <span className="text-white/40 uppercase tracking-widest text-sm mb-2">Projeção de Caixa</span>
                <motion.span 
                  key={cash}
                  initial={{ scale: 1.2, color: '#ffffff' }}
                  animate={{ scale: 1, color: '#ef4444' }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter"
                >
                  {formatter.format(cash)}
                </motion.span>
              </div>

              {/* Distrações Visuais (Boletos, Distratos) piscando */}
              {timeLeft <= 10 && timeLeft % 2 === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
                  className="absolute top-10 left-10 text-white/50 bg-red-900/20 p-2 font-sans text-xs rotate-12 border border-red-500"
                >
                  DISTRATO ASSINADO
                </motion.div>
              )}
              {timeLeft <= 7 && timeLeft % 3 === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
                  className="absolute bottom-20 right-10 text-white/50 bg-red-900/20 p-2 font-sans text-xs -rotate-6 border border-red-500"
                >
                  IMPOSTO ATRASADO
                </motion.div>
              )}

            </motion.div>
          ) : (
            <motion.div 
              key="silence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Silêncio brutal. Sem cores fortes, apenas a verdade crua. */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 2 }} // Fica 3 segundos no preto absoluto
              >
                <h1 className="text-white/80 text-3xl md:text-4xl font-serif italic mb-10 max-w-2xl leading-relaxed">
                  Sua empresa não explodiu.<br/>
                  Ela apenas <strong className="font-black not-italic text-white">sangrou silenciosamente</strong> enquanto você apagava os incêndios errados.
                </h1>
                <button 
                  onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
                  className="px-10 py-4 bg-[#D4AF37] hover:bg-white text-black font-black uppercase tracking-widest text-lg rounded transition-colors"
                >
                  Estancar o Sangramento
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </div>
  );
}
