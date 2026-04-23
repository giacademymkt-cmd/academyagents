import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RadarSonar({ onComplete }: { onComplete: () => void }) {
  const [dots, setDots] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [critical, setCritical] = useState(false);
  
  // Create blips over time
  useEffect(() => {
    if (!isScanning) return;
    
    let count = 0;
    const interval = setInterval(() => {
      count++;
      
      // Add random red dots closing in on the center
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 40; // Percentage from center
      
      setDots(prev => [...prev, { id: count, angle, distance }]);
      
      if (count > 25) {
        setIsScanning(false);
        setCritical(true);
      }
    }, 400);
    
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#010803] relative overflow-hidden font-mono">
      
      <div className="text-center mb-12 z-20">
        <h2 className="text-3xl font-light text-green-500 mb-2">Monitoramento de Gargalos</h2>
        <p className="text-green-500/50">Mapeando dependência operacional da equipe...</p>
      </div>

      {/* Radar Container */}
      <div className="relative w-[400px] h-[400px] rounded-full border border-green-500/30 bg-green-950/10 shadow-[0_0_50px_rgba(34,197,94,0.1)] flex items-center justify-center">
        
        {/* Radar Rings */}
        <div className="absolute inset-4 rounded-full border border-green-500/20" />
        <div className="absolute inset-16 rounded-full border border-green-500/20" />
        <div className="absolute inset-28 rounded-full border border-green-500/20" />
        
        {/* Radar Crosshairs */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-green-500/20" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-green-500/20" />

        {/* The Sweeping Arm */}
        {isScanning && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 w-1/2 h-[1px] bg-green-400 origin-left z-10"
            style={{ boxShadow: '0 -20px 40px 20px rgba(74,222,128,0.2)' }}
          >
            {/* The sweeping gradient tail */}
            <div className="absolute top-0 right-0 w-full h-[100px] bg-gradient-to-t from-green-500/40 to-transparent -translate-y-full origin-bottom rotate-[-90deg]" />
          </motion.div>
        )}

        {/* The Center (The Owner) */}
        <div className={`relative z-20 w-8 h-8 rounded-full ${critical ? 'bg-red-500 shadow-[0_0_30px_red]' : 'bg-green-500 shadow-[0_0_20px_green]'} flex items-center justify-center`}>
          <div className="absolute -bottom-8 whitespace-nowrap text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">VOCÊ</div>
        </div>

        {/* The Dots (Problems) */}
        {dots.map(dot => {
          // Calculate position based on angle and distance
          // Distance slowly moves towards 0 (the center)
          const top = 50 + Math.sin(dot.angle) * dot.distance;
          const left = 50 + Math.cos(dot.angle) * dot.distance;
          
          return (
            <motion.div
              key={dot.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, top: `${critical ? 50 : top}%`, left: `${critical ? 50 : left}%` }}
              transition={{ duration: critical ? 2 : 0.5 }}
              className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red] -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ top: `${top}%`, left: `${left}%` }}
            />
          );
        })}

      </div>

      <AnimatePresence>
        {critical && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-col items-center text-center z-20"
          >
            <div className="text-red-500 font-bold text-2xl mb-2 animate-pulse">ALERTA DE COLISÃO OPERACIONAL</div>
            <p className="text-neutral-400 max-w-md mb-8">Todos os problemas da empresa estão convergindo para uma única pessoa. O sistema vai quebrar.</p>
            
            <button 
              onClick={onComplete}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              Descentralizar Empresa →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
