import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertOctagon } from 'lucide-react';

export default function BleedingCalculator({ onComplete }: { onComplete?: () => void }) {
  const [hours, setHours] = useState(8);
  const [delegation, setDelegation] = useState(50);
  const [revenue, setRevenue] = useState(100);
  const [calculatedBleed, setCalculatedBleed] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Calcula o vazamento dinamicamente com base no input
  useEffect(() => {
    // formula: 
    // mais horas na operação = mais vazamento
    // menos delegacao = mais vazamento
    // faturamento base multiplica o problema
    const hourFactor = (hours - 4) / 10; // Acima de 4h diárias na operação já é risco
    const delegationFactor = (100 - delegation) / 100;
    
    let bleed = (revenue * 1000) * Math.max(0, hourFactor) * delegationFactor * 0.5;
    if (bleed < 0) bleed = 0;
    
    setCalculatedBleed(bleed);
  }, [hours, delegation, revenue]);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // A cor e intensidade da animação central muda baseada no vazamento
  const dangerLevel = Math.min(1, calculatedBleed / (revenue * 500)); 

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col md:flex-row bg-[#030303] overflow-hidden font-sans text-white">
      
      {!showResult ? (
        <>
          {/* Lado Esquerdo: Formulário Gamificado */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center z-10 bg-[#0A0A0A] border-r border-[#222]">
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-[#D4AF37]">Diagnóstico de Risco</h2>
            <p className="text-white/60 text-sm mb-12 leading-relaxed">
              Mova os controles abaixo para simular o grau de estagnação da sua empresa com base no seu nível de centralização.
            </p>

            <div className="space-y-10">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-4 uppercase tracking-widest text-white/80">
                  <span>Horas p/ dia na Operação</span>
                  <span className={hours > 8 ? 'text-red-500' : 'text-[#D4AF37]'}>{hours}h</span>
                </div>
                <input 
                  type="range" min="1" max="16" value={hours} 
                  onChange={e => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-4 uppercase tracking-widest text-white/80">
                  <span>% de Processos Delegados</span>
                  <span className={delegation < 40 ? 'text-red-500' : 'text-[#D4AF37]'}>{delegation}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="10" value={delegation} 
                  onChange={e => setDelegation(Number(e.target.value))}
                  className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-4 uppercase tracking-widest text-white/80">
                  <span>Faturamento Mensal Aprox.</span>
                  <span className="text-[#D4AF37]">{revenue}k</span>
                </div>
                <input 
                  type="range" min="10" max="1000" step="10" value={revenue} 
                  onChange={e => setRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowResult(true)}
              className="mt-12 w-full py-5 bg-[#111] hover:bg-[#D4AF37] hover:text-black border border-[#333] hover:border-[#D4AF37] transition-all font-bold tracking-widest uppercase rounded flex justify-center items-center gap-3 group"
            >
              <Activity className="group-hover:animate-pulse" /> Gerar Laudo
            </button>
          </div>

          {/* Lado Direito: Visualização em Tempo Real do Sangramento */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 bg-black">
            
            {/* Efeito visual pulsante de acordo com o dangerLevel */}
            <motion.div 
              className="absolute inset-0 z-0"
              style={{
                background: `radial-gradient(circle at center, rgba(255,0,0,${dangerLevel * 0.4}) 0%, transparent 70%)`
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 - (dangerLevel * 0.5) }}
            />

            <div className="relative z-10 text-center">
              <h3 className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-4">Lucro Oculto Vazando / Mês</h3>
              <motion.div 
                className="text-6xl md:text-7xl font-black tracking-tighter"
                style={{ 
                  color: dangerLevel > 0.5 ? '#ef4444' : '#D4AF37',
                  textShadow: `0 0 ${dangerLevel * 40}px rgba(255,0,0,0.5)`
                }}
                animate={{ scale: 1 + (dangerLevel * 0.1) }}
              >
                {formatter.format(calculatedBleed)}
              </motion.div>
              
              <AnimatePresence>
                {dangerLevel > 0.6 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-500/50 rounded-full text-red-500 text-xs font-bold uppercase tracking-widest"
                  >
                    <AlertOctagon size={14} /> Zona de Risco Crítico
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        /* Tela de Resultado / Climax */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="max-w-2xl">
            <h2 className="text-[#D4AF37] text-4xl font-black uppercase tracking-widest mb-6">Laudo Operacional</h2>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Sua centralização está custando aproximadamente <strong className="text-red-500">{formatter.format(calculatedBleed * 12)} por ano</strong> em oportunidades perdidas e ineficiência.
            </p>
            <div className="bg-[#111] border border-[#333] p-6 rounded-lg mb-10 text-left">
              <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-sm">O Veredito:</h4>
              <p className="text-white/60 text-sm">
                Empresas não quebram apenas por falta de vendas. Elas quebram porque o líder se torna o principal gargalo do crescimento. Você não precisa trabalhar mais horas, precisa de uma arquitetura de delegação.
              </p>
            </div>
            
            <button 
              onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
              className="w-full py-5 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-black uppercase tracking-widest text-lg rounded transition-transform hover:scale-105"
            >
              Conhecer a Metodologia
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
