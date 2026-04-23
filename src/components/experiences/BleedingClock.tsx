import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

export default function BleedingClock() {
  const [isHolding, setIsHolding] = useState(false);
  const [profit, setProfit] = useState(150000); // 150k MRR
  const [rotation, setRotation] = useState(0);
  const [isDead, setIsDead] = useState(false);
  
  const tickInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isDead) return;

    if (!isHolding) {
      // Tempo normal: ganha lucro devagar, relógio roda normal
      tickInterval.current = setInterval(() => {
        setRotation(r => r + 6);
        setProfit(p => p + 10);
      }, 1000);
    } else {
      // Tempo "parado" pelo fundador: o ponteiro trava, mas a empresa sangra dinheiro
      tickInterval.current = setInterval(() => {
        setProfit(p => {
          const newP = p - 2500;
          if (newP <= 0) {
            setIsDead(true);
            return 0;
          }
          return newP;
        });
      }, 100);
    }

    return () => clearInterval(tickInterval.current);
  }, [isHolding, isDead]);

  const handlePointerDown = () => {
    if (isDead) return;
    setIsHolding(true);
  };

  const handlePointerUp = () => {
    if (isDead) return;
    setIsHolding(false);
  };

  // Formata o dinheiro
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div 
      className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      
      {/* Background que escurece e fica vermelho se isHolding */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          backgroundColor: isHolding ? '#1a0505' : '#050505',
          boxShadow: isHolding ? 'inset 0 0 150px rgba(255,0,0,0.2)' : 'inset 0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
        
        {/* Mostrador de Lucro */}
        <motion.div 
          className="mb-12 text-center"
          animate={{ scale: isHolding ? 1.1 : 1, y: isHolding ? 20 : 0 }}
        >
          <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] mb-2">Faturamento Atual</h3>
          <motion.h1 
            className={`text-5xl font-black tracking-tighter ${isHolding ? 'text-red-500' : 'text-white'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
            animate={isHolding ? { x: [-2, 2, -2, 2, 0] } : {}}
            transition={{ repeat: isHolding ? Infinity : 0, duration: 0.1 }}
          >
            {formatter.format(profit)}
          </motion.h1>
          <AnimatePresence>
            {isHolding && !isDead && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 font-bold mt-2 uppercase tracking-widest text-sm"
              >
                Parando a máquina para "arrumar a casa"
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* O Relógio Suíço */}
        <div className="relative w-80 h-80 rounded-full border-[8px] border-[#111] bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_5px_20px_rgba(212,175,55,0.1)] flex items-center justify-center">
          
          {/* Marcas das horas */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 bg-[#333] rounded-full"
              style={{ 
                height: i % 3 === 0 ? '16px' : '8px',
                transform: `rotate(${i * 30}deg) translateY(-140px)` 
              }}
            />
          ))}

          {/* Ponteiros Fake (Hora/Minuto) */}
          <div className="absolute w-2 h-24 bg-[#555] rounded-full origin-bottom" style={{ transform: 'rotate(45deg) translateY(-50%)' }} />
          <div className="absolute w-1.5 h-32 bg-[#D4AF37] rounded-full origin-bottom" style={{ transform: 'rotate(180deg) translateY(-50%)' }} />

          {/* Ponteiro dos Segundos (Interativo) */}
          <motion.div
            className="absolute w-1 h-36 origin-bottom z-20 cursor-grab active:cursor-grabbing"
            style={{ transformOrigin: 'bottom center', bottom: '50%' }}
            animate={{ rotate: rotation }}
            transition={isHolding ? { type: 'spring', stiffness: 500, damping: 20 } : { type: 'tween', ease: 'linear', duration: 1 }}
            onPointerDown={handlePointerDown}
          >
            <div className="w-full h-full bg-red-600 rounded-t-full shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
            
            {/* Hitbox maior para facilitar o clique no mobile */}
            <div className="absolute top-0 -left-6 w-12 h-full bg-transparent" />
          </motion.div>

          {/* Pino Central */}
          <div className="absolute w-4 h-4 bg-[#D4AF37] rounded-full z-30 shadow-lg" />
          <div className="absolute w-1.5 h-1.5 bg-black rounded-full z-40" />

          {/* Dica Flutuante */}
          <AnimatePresence>
            {!isHolding && !isDead && rotation < 120 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-[-40px] bg-[#D4AF37] text-black px-3 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg animate-bounce pointer-events-none"
              >
                Segure o ponteiro para "parar o tempo"
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Clímax Final */}
        <AnimatePresence>
          {isDead && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
            >
              <h2 className="text-red-600 text-4xl md:text-5xl font-black uppercase tracking-widest mb-6 text-center">
                Falência Operacional
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md text-center leading-relaxed">
                Você não pode parar o relógio para "arrumar a casa". Líderes de verdade consertam o motor com o avião voando através de processos delegados.
              </p>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                }}
                className="inline-block w-full max-w-sm py-4 rounded bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-center text-sm tracking-widest uppercase transition-colors"
              >
                Construir Esteiras de Delegação
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
