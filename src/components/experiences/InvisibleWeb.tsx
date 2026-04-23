import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const NODES = [
  { id: 'vendas', label: 'Vendas', x: -100, y: -100 },
  { id: 'suporte', label: 'Suporte', x: 100, y: -100 },
  { id: 'financeiro', label: 'Caixa', x: -100, y: 100 },
  { id: 'rh', label: 'Equipe', x: 100, y: 100 },
];

export default function InvisibleWeb() {
  const [tension, setTension] = useState(0); // 0 a 100
  const [isBroken, setIsBroken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Simula a tensão subindo continuamente enquanto segura o botão
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tension > 0 && tension < 100 && !isBroken) {
      interval = setInterval(() => {
        setTension(prev => {
          if (prev >= 100) {
            setIsBroken(true);
            return 100;
          }
          // Se não estivermos clicando, a tensão desce um pouquinho (elasticidade),
          // Mas na prática vamos fazer a tensão subir ao clicar num nó.
          return prev;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [tension, isBroken]);

  const handlePull = () => {
    if (isBroken) return;
    setTension(prev => {
      const next = prev + 15;
      if (next >= 100) {
        setIsBroken(true);
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        return 100;
      }
      return next;
    });
  };

  const handleRelease = () => {
    if (isBroken) return;
    // Tensão cede de leve, mas o dano é cumulativo se não houver processos
    setTension(prev => Math.max(0, prev - 5));
  };

  // Cores dinâmicas baseadas na tensão
  const centerColor = tension < 50 ? '#D4AF37' : tension < 80 ? '#C85A2A' : '#ff0000';
  const centerSize = 80 + (tension * 1.5);
  const shakeOffset = tension > 60 ? (tension - 60) / 5 : 0;

  return (
    <div 
      className="relative w-full h-full min-h-[700px] flex items-center justify-center bg-[#030303] overflow-hidden font-sans select-none"
      ref={containerRef}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#111,_#000)]" />
      
      {/* HUD Header */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <h2 className="text-[#D4AF37] text-2xl font-black uppercase tracking-widest mb-2">A Teia Invisível</h2>
        <p className="text-white/60 text-sm max-w-sm mx-auto">
          Tente resolver os problemas da operação clicando nos departamentos. Cuidado com o centro.
        </p>
      </div>

      <div className="relative z-10 w-[400px] h-[400px] flex items-center justify-center">
        
        {/* SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <AnimatePresence>
            {!isBroken && NODES.map((node, i) => {
              const strokeWidth = 2 + (tension / 20);
              const opacity = 0.3 + (tension / 200);
              return (
                <motion.line
                  key={node.id}
                  x1="200" y1="200" // Center
                  x2={200 + node.x} y2={200 + node.y}
                  stroke={centerColor}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ opacity: 0 }}
                  filter="url(#glow)"
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Nós Periféricos */}
        <AnimatePresence>
          {!isBroken && NODES.map((node) => (
            <motion.div
              key={node.id}
              className="absolute w-16 h-16 rounded-full bg-[#111] border border-[#555] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 hover:border-[#D4AF37] hover:bg-[#222] active:scale-95 transition-colors"
              style={{ x: node.x, y: node.y }}
              onPointerDown={handlePull}
              onPointerUp={handleRelease}
              onPointerLeave={handleRelease}
              whileHover={{ scale: 1.1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            >
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{node.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Nó Central (Fundador) */}
        <AnimatePresence>
          {!isBroken ? (
            <motion.div
              className="absolute rounded-full flex flex-col items-center justify-center z-30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              style={{
                width: centerSize,
                height: centerSize,
                backgroundColor: '#111',
                border: `4px solid ${centerColor}`,
                boxShadow: `0 0 ${tension}px ${centerColor}80`
              }}
              animate={{
                x: [-shakeOffset, shakeOffset, -shakeOffset, shakeOffset, 0],
                y: [shakeOffset, -shakeOffset, shakeOffset, -shakeOffset, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
            >
              <span className="text-white font-bold text-xs uppercase tracking-widest">Fundador</span>
              <span className="text-white/50 text-[10px] mt-1">{Math.round(tension)}% Carga</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute z-50 flex flex-col items-center text-center w-[350px] bg-[#0A0A0A]/90 backdrop-blur-md border border-red-900/50 p-8 rounded-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h2 className="text-red-500 text-3xl font-black uppercase tracking-widest mb-4">Colapso Sistêmico</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                Tentar resolver problemas isolados puxando tudo para você rompe a rede. Sem processos independentes, você é o ponto único de falha.
              </p>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                }}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-sm tracking-widest uppercase rounded transition-colors"
              >
                Criar uma Equipe Autogerenciável
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
