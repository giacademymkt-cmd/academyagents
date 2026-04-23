import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PayrollAbyss() {
  const [energy, setEnergy] = useState(100);
  const [isDead, setIsDead] = useState(false);
  
  // Dreno contínuo (Custo Fixo)
  useEffect(() => {
    if (isDead) return;
    
    const interval = setInterval(() => {
      setEnergy(prev => {
        const next = prev - 8; // Dreno agressivo
        if (next <= 0) {
          setIsDead(true);
          return 0;
        }
        return next;
      });
    }, 200); // 5 vezes por segundo
    
    return () => clearInterval(interval);
  }, [isDead]);

  const handleWork = () => {
    if (isDead) return;
    setEnergy(prev => Math.min(100, prev + 15));
    if (navigator.vibrate) navigator.vibrate(20);
  };

  // O tamanho da "boca do abismo" varia inversamente com a energia.
  // 100 energia = abismo pequeno (20%). 0 energia = engole a tela (150%)
  const abyssScale = 1.5 - (energy / 100);

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-center bg-[#000] overflow-hidden font-sans select-none perspective-[1000px]">
      
      {/* O Abismo Visual (Túnel 3D com CSS) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div 
          className="relative rounded-full border border-red-900/20 shadow-[0_0_100px_inset_#000]"
          style={{ 
            width: '800px', 
            height: '800px', 
            backgroundImage: 'repeating-radial-gradient(circle at center, #110000 0%, #000 10%, #110000 20%)',
            boxShadow: '0 0 100px rgba(200,0,0,0.2)'
          }}
          animate={{ 
            scale: isDead ? 5 : abyssScale,
            rotate: isDead ? 180 : 0
          }}
          transition={isDead ? { duration: 1.5, ease: "easeIn" } : { type: "tween", duration: 0.2 }}
        >
          {/* Boca central negra */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-black rounded-full shadow-[0_0_100px_#000,inset_0_0_50px_#000]" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        
        {/* Header HUD */}
        {!isDead && (
          <div className="text-center mb-12 bg-[#0A0A0A]/80 backdrop-blur-md p-4 rounded border border-[#333]">
            <h2 className="text-[#C85A2A] font-black uppercase tracking-widest text-lg mb-1">Custo Fixo vs Receita</h2>
            <p className="text-white/60 text-xs">A folha de pagamento não espera você descansar.</p>
          </div>
        )}

        {/* Barra de Energia/Caixa */}
        {!isDead && (
          <div className="w-full h-8 bg-[#111] border-2 border-[#333] rounded-full overflow-hidden mb-8 relative">
            <motion.div 
              className={`h-full ${energy > 50 ? 'bg-[#D4AF37]' : 'bg-red-600'} transition-colors duration-300`}
              style={{ width: `${energy}%` }}
              layout
            />
            <div className="absolute inset-0 flex items-center justify-center mix-blend-difference pointer-events-none">
              <span className="text-white font-bold text-xs uppercase tracking-widest">Caixa Atual</span>
            </div>
          </div>
        )}

        {/* Botão de "Trabalhar" */}
        <motion.button
          onClick={handleWork}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-40 h-40 rounded-full border-4 ${isDead ? 'border-red-900 bg-red-900/20 text-red-900' : 'border-[#D4AF37] bg-[#111] hover:bg-[#222] text-[#D4AF37]'} flex flex-col items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)] transition-colors z-20`}
          disabled={isDead}
        >
          <span className="font-black text-2xl uppercase tracking-tighter">Gerar<br/>Caixa</span>
        </motion.button>

        {/* Dica */}
        <AnimatePresence>
          {!isDead && energy < 100 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/50 text-xs uppercase tracking-widest mt-8 animate-pulse"
            >
              Continue clicando para sobreviver
            </motion.p>
          )}
        </AnimatePresence>

        {/* Clímax Final */}
        <AnimatePresence>
          {isDead && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] flex flex-col items-center justify-center bg-black/90 border border-red-900 p-8 rounded backdrop-blur-md text-center z-50"
            >
              <h2 className="text-red-600 text-3xl font-black uppercase tracking-widest mb-4">
                O Abismo Venceu
              </h2>
              <p className="text-white/80 text-sm mb-8 leading-relaxed">
                Se a sua equipe não se paga sozinha através de esteiras comerciais previsíveis, você não tem uma empresa, você tem um ralo de luxo.
              </p>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                }}
                className="inline-block w-full py-4 rounded bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-sm tracking-widest uppercase transition-colors"
              >
                Blindar o Caixa
              </a>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
