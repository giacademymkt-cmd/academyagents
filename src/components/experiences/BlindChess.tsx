import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ícones SVG minimalistas para as Peças de Xadrez
const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const PawnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
    <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
    <path d="M12 8v4"/>
    <path d="M9 12h6"/>
    <path d="M10 16v4"/>
    <path d="M14 16v4"/>
    <path d="M8 20h8"/>
  </svg>
);

const MOCK_BOARD = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  isBlack: (Math.floor(i / 4) + i) % 2 === 1, // Xadrez 4x4
}));

const ERROR_MESSAGES = [
  "O Rei tentou fazer o trabalho do Peão. Xeque-mate operacional.",
  "Falta de delegação. O bispo ficou esperando sua ordem e a venda caiu.",
  "Você moveu a torre, mas o fluxo de caixa ficou desprotegido."
];

export default function BlindChess() {
  const [moves, setMoves] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const handlePieceClick = () => {
    if (isGameOver) return;
    
    setMoves(m => m + 1);
    
    // Mostra erro aleatório
    const msg = ERROR_MESSAGES[Math.min(moves, ERROR_MESSAGES.length - 1)];
    setErrorMsg(msg);
    
    if (moves >= 2) {
      setTimeout(() => setIsGameOver(true), 1500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex items-center justify-center bg-[#050505] overflow-hidden font-sans select-none perspective-[1000px]">
      
      {/* Background radial soft */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1500] via-[#050505] to-[#000]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h2 className="text-[#D4AF37] text-3xl font-black uppercase tracking-widest mb-2">O Xadrez Cego</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Mova suas peças para salvar a operação. Mas lembre-se: o Rei não pode jogar em todas as posições ao mesmo tempo.
          </p>
        </div>

        {/* Tabuleiro (Pseudo 3D) */}
        <motion.div 
          className="grid grid-cols-4 w-[320px] h-[320px] border-4 border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          initial={{ rotateX: 45, rotateZ: 0 }}
          animate={{ rotateX: 45, rotateZ: isGameOver ? 15 : 0 }}
          transition={{ duration: 1 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {MOCK_BOARD.map((square, i) => (
            <div 
              key={square.id} 
              className={`relative flex items-center justify-center cursor-pointer transition-colors ${square.isBlack ? 'bg-[#111]' : 'bg-[#222]'} hover:bg-[#D4AF37]/20`}
              onClick={handlePieceClick}
            >
              {/* Algumas peças de exemplo */}
              {i === 12 && (
                <motion.div 
                  className="absolute"
                  style={{ transform: 'translateZ(20px) rotateX(-45deg)' }}
                >
                  <CrownIcon />
                </motion.div>
              )}
              {[1, 3, 5, 8].includes(i) && (
                <motion.div 
                  className="absolute opacity-50"
                  style={{ transform: 'translateZ(10px) rotateX(-45deg)' }}
                >
                  <PawnIcon />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* HUD de Erro */}
        <div className="mt-12 h-16 w-full flex justify-center">
          <AnimatePresence mode="wait">
            {errorMsg && !isGameOver && (
              <motion.div
                key={errorMsg}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/40 border border-red-500/50 text-red-200 px-6 py-3 rounded-lg text-sm text-center max-w-md shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fim de Jogo */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <h2 className="text-red-600 text-5xl font-black uppercase tracking-tighter mb-4" style={{ textShadow: '0 0 30px rgba(220,38,38,0.5)' }}>
                Xeque-Mate
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md text-center">
                Se você joga pela sua equipe, ninguém protege o Rei. Aprenda a construir um tabuleiro que joga sozinho.
              </p>
              
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                }}
                className="bg-[#D4AF37] text-black px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-[#b5952f] transition-colors"
              >
                Dominar a Delegação
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
